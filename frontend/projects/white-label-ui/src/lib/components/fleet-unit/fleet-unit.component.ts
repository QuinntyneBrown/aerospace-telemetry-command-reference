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
  selector: 'viam-fleet-unit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fleet-unit.component.html',
  host: {
    class: 'fleet-unit',
  },
  styleUrl: './fleet-unit.component.scss',
})
export class ViamFleetUnitComponent {
  @Input() name = '';
  @Input() detail = '';
}
