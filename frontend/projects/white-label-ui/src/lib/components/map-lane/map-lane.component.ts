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
  selector: 'viam-map-lane',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './map-lane.component.html',
  host: {
    class: 'map-lane',
    '[class.one]': 'variant === "one"',
    '[class.two]': 'variant === "two"',
  },
  styleUrl: './map-lane.component.scss',
})
export class ViamMapLaneComponent {
  @Input() variant: 'one' | 'two' | 'custom' = 'custom';
}
