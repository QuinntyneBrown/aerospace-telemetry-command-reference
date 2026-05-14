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
  selector: 'viam-chart-body',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chart-body.component.html',
  host: {
    class: 'chart-body',
    '[class.compact]': 'compact',
  },
  styleUrl: './chart-body.component.scss',
})
export class ViamChartBodyComponent {
  @Input({ transform: booleanAttribute }) compact = false;
}
