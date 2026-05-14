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

import { ViamRailButtonComponent } from '../rail-button/rail-button.component';

@Component({
  selector: 'viam-rail-nav',
  standalone: true,
  imports: [ViamRailButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rail-nav.component.html',
  host: {
    class: 'rail',
    'aria-label': 'Primary navigation',
  },
  styleUrl: './rail-nav.component.scss',
})
export class ViamRailNavComponent {
  @Input() items: readonly ViamRailItem[] = [];
  @Input() activeValue = '';

  @Output() selected = new EventEmitter<string>();
}
