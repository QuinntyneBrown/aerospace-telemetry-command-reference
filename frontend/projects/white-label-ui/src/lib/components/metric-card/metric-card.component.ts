import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
} from '@angular/core';

import {
  VIAM_TILE_SIZE_OPTIONS,
  type ViamButtonType,
  type ViamCommandAction,
  type ViamEventItem,
  type ViamFleetRow,
  type ViamKeyValueItem,
  type ViamMapNode,
  type ViamRailItem,
  type ViamSelectOption,
  type ViamTileSize,
  type ViamTone,
} from '../../models';

import { ViamMdCardComponent } from '../md-card/md-card.component';
import { ViamMetricIconComponent } from '../metric-icon/metric-icon.component';
import { ViamMetricTrendComponent } from '../metric-trend/metric-trend.component';

@Component({
  selector: 'viam-metric-card',
  standalone: true,
  imports: [ViamMdCardComponent, ViamMetricIconComponent, ViamMetricTrendComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.scss',
})
export class ViamMetricCardComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() trend = '';
  @Input() trendIcon = 'trending_up';
  @Input() tone: ViamTone = 'success';
  @Input() icon = 'monitoring';
  @Input() color = 'var(--viam-info, #8be7ff)';
}
