import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { type ViamEventItem, ViamEventStreamComponent } from 'white-label-ui';

import { type DashboardEvent, type DashboardTileDefinition } from '../../models';

@Component({
  selector: 'viam-platform-event-stream-tile',
  standalone: true,
  imports: [ViamEventStreamComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-stream-tile.component.html',
  styleUrl: './event-stream-tile.component.scss',
})
export class EventStreamTileComponent {
  @Input({ required: true }) definition!: DashboardTileDefinition;

  protected get subtitle(): string {
    return (
      (this.definition.metadata?.['subtitle'] as string | undefined) ??
      'Latest machine and operator events'
    );
  }

  protected get events(): readonly ViamEventItem[] {
    const configured =
      (this.definition.metadata?.['events'] as readonly DashboardEvent[] | undefined) ?? [];

    return configured.map((event) => ({
      title: event.title,
      detail: event.detail,
      time: event.time,
      icon: event.icon,
      color: this.toneColor(event.tone),
    }));
  }

  private toneColor(tone: DashboardEvent['tone']): string {
    switch (tone) {
      case 'success':
        return 'var(--viam-success, #4fe3a4)';
      case 'warning':
        return 'var(--viam-warning, #ffd166)';
      case 'danger':
        return 'var(--viam-danger, #ff687e)';
      case 'info':
        return 'var(--viam-info, #8be7ff)';
      case 'neutral':
        return 'var(--viam-muted, #8793a0)';
    }
  }
}
