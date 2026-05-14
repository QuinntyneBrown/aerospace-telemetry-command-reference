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
  selector: 'viam-brand-mark',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './brand-mark.component.html',
  host: {
    class: 'brand-mark',
    '[attr.aria-label]': 'ariaLabel || null',
  },
  styleUrl: './brand-mark.component.scss',
})
export class ViamBrandMarkComponent {
  @Input() mark = 'V';
  @Input() ariaLabel = '';
}
