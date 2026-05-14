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

import { ViamSelectFieldComponent } from '../select-field/select-field.component';

@Component({
  selector: 'viam-tile-size-select',
  standalone: true,
  imports: [ViamSelectFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tile-size-select.component.html',
  styleUrl: './tile-size-select.component.scss',
})
export class ViamTileSizeSelectComponent {
  protected readonly sizeOptions = VIAM_TILE_SIZE_OPTIONS;

  @Input() size: ViamTileSize = 'medium';
  @Input() ariaLabel = 'Resize tile';
  @Input({ transform: booleanAttribute }) disabled = false;

  @Output() sizeChange = new EventEmitter<ViamTileSize>();

  onSizeChange(value: string): void {
    this.sizeChange.emit(value as ViamTileSize);
  }
}
