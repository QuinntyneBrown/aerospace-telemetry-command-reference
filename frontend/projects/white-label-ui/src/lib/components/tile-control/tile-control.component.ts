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

import { ViamIconComponent } from '../icon/icon.component';

@Component({
  selector: 'viam-tile-control',
  standalone: true,
  imports: [ViamIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tile-control.component.html',
  styleUrl: './tile-control.component.scss',
})
export class ViamTileControlComponent {
  @Input() icon = 'close';
  @Input() title = '';
  @Input() ariaLabel = '';
  @Input({ transform: booleanAttribute }) danger = false;
  @Input({ transform: booleanAttribute }) disabled = false;

  @Output() clicked = new EventEmitter<MouseEvent>();
}
