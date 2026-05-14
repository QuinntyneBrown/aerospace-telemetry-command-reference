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
  selector: 'viam-segment-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './segment-button.component.html',
  styleUrl: './segment-button.component.scss',
})
export class ViamSegmentButtonComponent {
  @Input() label = '';
  @Input() value = '';
  @Input({ transform: booleanAttribute }) active = false;
  @Input({ transform: booleanAttribute }) disabled = false;

  @Output() selected = new EventEmitter<string>();
}
