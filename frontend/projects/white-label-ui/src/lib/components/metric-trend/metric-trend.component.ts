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

import { ViamIconComponent } from '../icon/icon.component';

@Component({
  selector: 'viam-metric-trend',
  standalone: true,
  imports: [ViamIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './metric-trend.component.html',
  host: {
    class: 'metric-trend',
    '[attr.data-tone]': 'tone',
  },
  styleUrl: './metric-trend.component.scss',
})
export class ViamMetricTrendComponent {
  @Input() label = '';
  @Input() icon = 'trending_up';
  @Input() tone: ViamTone = 'success';
}
