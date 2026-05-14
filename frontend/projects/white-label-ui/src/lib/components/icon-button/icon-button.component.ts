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
  selector: 'viam-icon-button',
  standalone: true,
  imports: [ViamIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
})
export class ViamIconButtonComponent {
  @Input() icon = '';
  @Input() title = '';
  @Input() ariaLabel = '';
  @Input() type: ViamButtonType = 'button';
  @Input({ transform: booleanAttribute }) disabled = false;

  @Output() clicked = new EventEmitter<MouseEvent>();
}
