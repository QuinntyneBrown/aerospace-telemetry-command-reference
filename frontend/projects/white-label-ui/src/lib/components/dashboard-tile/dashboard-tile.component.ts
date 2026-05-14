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
  selector: 'viam-dashboard-tile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-tile.component.html',
  host: {
    class: 'dashboard-tile',
    '[attr.data-size]': 'size',
    '[attr.aria-label]': 'ariaLabel || null',
  },
  styleUrl: './dashboard-tile.component.scss',
})
export class ViamDashboardTileComponent {
  @Input() size: ViamTileSize = 'medium';
  @Input() ariaLabel = '';
}
