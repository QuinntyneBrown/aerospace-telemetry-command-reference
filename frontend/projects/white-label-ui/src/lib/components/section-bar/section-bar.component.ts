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

import { ViamSectionTitleComponent } from '../section-title/section-title.component';

@Component({
  selector: 'viam-section-bar',
  standalone: true,
  imports: [ViamSectionTitleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './section-bar.component.html',
  host: {
    class: 'section-bar',
  },
  styleUrl: './section-bar.component.scss',
})
export class ViamSectionBarComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
