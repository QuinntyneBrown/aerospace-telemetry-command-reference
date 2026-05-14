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
  selector: 'viam-metric-icon',
  standalone: true,
  imports: [ViamIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './metric-icon.component.html',
  host: {
    class: 'metric-icon',
    '[style.--icon-color]': 'color',
  },
  styleUrl: './metric-icon.component.scss',
})
export class ViamMetricIconComponent {
  @Input() icon = 'monitoring';
  @Input() color = 'var(--viam-info, #8be7ff)';
}
