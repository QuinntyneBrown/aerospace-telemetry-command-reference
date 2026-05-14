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
  selector: 'viam-rail-button',
  standalone: true,
  imports: [ViamIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rail-button.component.html',
  styleUrl: './rail-button.component.scss',
})
export class ViamRailButtonComponent {
  @Input() label = '';
  @Input() icon = '';
  @Input() value = '';
  @Input({ transform: booleanAttribute }) active = false;
  @Input({ transform: booleanAttribute }) disabled = false;

  @Output() selected = new EventEmitter<string>();
}
