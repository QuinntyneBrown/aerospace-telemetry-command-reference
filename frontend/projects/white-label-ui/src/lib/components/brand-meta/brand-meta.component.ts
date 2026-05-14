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
  selector: 'viam-brand-meta',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './brand-meta.component.html',
  host: {
    class: 'brand-meta',
  },
  styleUrl: './brand-meta.component.scss',
})
export class ViamBrandMetaComponent {
  @Input() name = '';
  @Input() description = '';
}
