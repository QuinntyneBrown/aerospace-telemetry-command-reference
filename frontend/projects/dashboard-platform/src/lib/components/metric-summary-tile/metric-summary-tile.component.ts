import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ViamMetricCardComponent } from 'white-label-ui';

import { type DashboardTileDefinition } from '../../models';

interface MetricTileItem {
  readonly label: string;
  readonly value: string;
  readonly trend?: string;
  readonly icon?: string;
  readonly color?: string;
}

@Component({
  selector: 'viam-platform-metric-summary-tile',
  standalone: true,
  imports: [ViamMetricCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './metric-summary-tile.component.html',
  styleUrl: './metric-summary-tile.component.scss',
})
export class MetricSummaryTileComponent {
  @Input({ required: true }) definition!: DashboardTileDefinition;

  protected get metrics(): readonly MetricTileItem[] {
    return (this.definition.metadata?.['metrics'] as readonly MetricTileItem[] | undefined) ?? [];
  }
}
