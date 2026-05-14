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

import { ViamCardTitleComponent } from '../card-title/card-title.component';

@Component({
  selector: 'viam-card-header',
  standalone: true,
  imports: [ViamCardTitleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card-header.component.html',
  host: {
    class: 'card-header',
  },
  styleUrl: './card-header.component.scss',
})
export class ViamCardHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
