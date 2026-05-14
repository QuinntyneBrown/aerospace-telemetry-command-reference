import { Injectable, NgZone, inject } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';

import { type ITelemetryStreamService } from '../contracts';
import { type Machine, type MachineStatus, type TelemetrySample } from '../models';
import { DASHBOARD_API_BASE_URL, TELEMETRY_STREAMS, TENANT_CONFIG } from '../tokens';

interface DemoTokenResponse {
  readonly accessToken: string;
}

interface BackendBatteryDto {
  readonly percent: number;
  readonly isCharging: boolean;
}

interface BackendPositionDto {
  readonly latitude: number;
  readonly longitude: number;
  readonly headingDegrees?: number | null;
}

interface BackendMachineDto {
  readonly id: string;
  readonly name: string;
  readonly model: string;
  readonly status: string | number;
  readonly position: BackendPositionDto;
  readonly battery: BackendBatteryDto;
  readonly missionState: string;
  readonly updatedAt: string;
}

interface BackendTelemetrySampleDto {
  readonly id: string;
  readonly machineId: string;
  readonly streamKey: string;
  readonly metricKey: string;
  readonly numericValue?: number | null;
  readonly textValue?: string | null;
  readonly position?: BackendPositionDto | null;
  readonly recordedAt: string;
}

interface BackendTelemetryUpdateDto {
  readonly sample: BackendTelemetrySampleDto;
}

interface BackendMachineStatusUpdateDto {
  readonly machineId: string;
  readonly status: string | number;
  readonly updatedAt: string;
}

type WindowWithTelemetryProbe = Window &
  typeof globalThis & {
    __ninjaTelemetrySamples?: readonly TelemetrySample[];
  };

@Injectable()
export class BackendTelemetryStreamService implements ITelemetryStreamService {
  private readonly tenant = inject(TENANT_CONFIG);
  private readonly telemetryStreams = inject(TELEMETRY_STREAMS);
  private readonly apiBaseUrl = inject(DASHBOARD_API_BASE_URL);
  private readonly zone = inject(NgZone);

  private readonly machinesSubject = new BehaviorSubject<readonly Machine[]>([]);
  private readonly samplesSubject = new BehaviorSubject<readonly TelemetrySample[]>([]);

  private started = false;
  private tokenPromise: Promise<string> | null = null;
  private connection: HubConnection | null = null;

  machines(): Observable<readonly Machine[]> {
    void this.ensureStarted();
    return this.machinesSubject.asObservable();
  }

  samples(): Observable<readonly TelemetrySample[]> {
    void this.ensureStarted();
    return this.samplesSubject.asObservable();
  }

  private async ensureStarted(): Promise<void> {
    if (this.started) {
      return;
    }

    this.started = true;

    try {
      await this.loadInitialState();
      await this.connectTelemetryHub();
      await this.request(`/api/v1/simulation/${this.tenantSlug}/start`, { method: 'POST' });
    } catch (error) {
      console.warn('Backend telemetry stream unavailable; charts will keep configured seed data.', error);
    }
  }

  private async loadInitialState(): Promise<void> {
    const machines = await this.request<readonly BackendMachineDto[]>(
      `/api/v1/tenants/${this.tenantSlug}/machines`,
    );
    this.machinesSubject.next(machines.map((machine) => this.mapMachine(machine)));

    const latestSamples = await Promise.all(
      machines.map((machine) =>
        this.request<readonly BackendTelemetrySampleDto[]>(
          `/api/v1/tenants/${this.tenantSlug}/machines/${machine.id}/telemetry/latest`,
        ),
      ),
    );

    this.setSamples(latestSamples.flat().map((sample) => this.mapSample(sample)));
  }

  private async connectTelemetryHub(): Promise<void> {
    this.connection = new HubConnectionBuilder()
      .withUrl(`${this.apiBaseUrl}/hubs/telemetry`, {
        accessTokenFactory: () => this.getToken(),
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    this.connection.on('TelemetryReceived', (update: BackendTelemetryUpdateDto) => {
      this.zone.run(() => this.addSample(this.mapSample(update.sample)));
    });

    this.connection.on('MachineStatusChanged', (update: BackendMachineStatusUpdateDto) => {
      this.zone.run(() => this.updateMachineStatus(update));
    });

    await this.connection.start();
    await this.connection.invoke('SubscribeTenant', this.tenantSlug);
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await this.getToken();
    const response = await fetch(`${this.apiBaseUrl}${path}`, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText} for ${path}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }

  private async getToken(): Promise<string> {
    this.tokenPromise ??= fetch(`${this.apiBaseUrl}/api/v1/auth/demo-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: `${this.tenantSlug}-frontend-demo`,
        tenantSlugs: [this.tenantSlug],
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to create demo token: ${response.status}`);
        }

        return response.json() as Promise<DemoTokenResponse>;
      })
      .then((response) => response.accessToken);

    return this.tokenPromise;
  }

  private mapMachine(machine: BackendMachineDto): Machine {
    return {
      id: machine.id,
      name: machine.name,
      type: machine.model,
      status: this.mapStatus(machine.status),
      healthPercent: String(machine.status).toLowerCase() === 'faulted' ? 42 : 92,
      location: {
        latitude: machine.position.latitude,
        longitude: machine.position.longitude,
        headingDegrees: machine.position.headingDegrees ?? undefined,
      },
      batteryPercent: Math.round(machine.battery.percent),
      missionState: machine.missionState,
      lastSeenAt: machine.updatedAt,
    };
  }

  private mapSample(sample: BackendTelemetrySampleDto): TelemetrySample {
    const stream = this.telemetryStreams.find((candidate) => candidate.id === sample.streamKey);
    const value =
      sample.numericValue ??
      sample.textValue ??
      (sample.position
        ? {
            latitude: sample.position.latitude,
            longitude: sample.position.longitude,
            headingDegrees: sample.position.headingDegrees ?? undefined,
          }
        : null);

    return {
      id: sample.id,
      streamId: sample.streamKey,
      machineId: sample.machineId,
      timestamp: sample.recordedAt,
      value,
      unit: stream?.unit,
      quality: 'good',
      metadata: {
        metricKey: sample.metricKey,
        source: 'backend-signalr',
      },
    };
  }

  private addSample(sample: TelemetrySample): void {
    const next = [
      ...this.samplesSubject.value.filter((current) => current.id !== sample.id),
      sample,
    ].slice(-120);
    this.setSamples(next);
  }

  private setSamples(samples: readonly TelemetrySample[]): void {
    this.samplesSubject.next(samples);

    if (typeof window !== 'undefined') {
      (window as WindowWithTelemetryProbe).__ninjaTelemetrySamples = samples;
    }
  }

  private updateMachineStatus(update: BackendMachineStatusUpdateDto): void {
    this.machinesSubject.next(
      this.machinesSubject.value.map((machine) =>
        machine.id === update.machineId
          ? { ...machine, status: this.mapStatus(update.status), lastSeenAt: update.updatedAt }
          : machine,
      ),
    );
  }

  private mapStatus(status: string | number): MachineStatus {
    switch (String(status).toLowerCase()) {
      case 'online':
      case '1':
      case 'busy':
      case '2':
        return 'online';
      case 'warning':
      case '3':
        return 'degraded';
      case 'faulted':
      case '4':
        return 'faulted';
      default:
        return 'offline';
    }
  }

  private get tenantSlug(): string {
    if (this.tenant.id === 'viam-reference') {
      return 'white-label';
    }

    return this.tenant.id;
  }
}
