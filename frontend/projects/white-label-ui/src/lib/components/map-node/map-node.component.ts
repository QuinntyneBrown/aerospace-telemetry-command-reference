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
  selector: 'viam-map-node',
  standalone: true,
  imports: [ViamIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './map-node.component.html',
  host: {
    class: 'map-node',
    '[style.left]': 'left',
    '[style.top]': 'top',
    '[style.--node-color]': 'color',
    '[attr.aria-label]': 'label || null',
  },
  styleUrl: './map-node.component.scss',
})
export class ViamMapNodeComponent {
  @Input() icon = 'precision_manufacturing';
  @Input() left = '50%';
  @Input() top = '50%';
  @Input() color = 'var(--viam-info, #8be7ff)';
  @Input() label = '';
}
