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

@Component({
  selector: 'viam-status-chip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './status-chip.component.html',
  host: {
    class: 'status-chip',
    '[style.--chip-color]': 'color',
  },
  styleUrl: './status-chip.component.scss',
})
export class ViamStatusChipComponent {
  @Input() label = '';
  @Input() color = 'var(--viam-info, #8be7ff)';
}
