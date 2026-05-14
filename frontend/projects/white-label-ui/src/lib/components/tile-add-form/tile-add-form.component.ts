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

import { ViamFilledTonalButtonComponent } from '../filled-tonal-button/filled-tonal-button.component';
import { ViamSelectFieldComponent } from '../select-field/select-field.component';

@Component({
  selector: 'viam-tile-add-form',
  standalone: true,
  imports: [ViamFilledTonalButtonComponent, ViamSelectFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tile-add-form.component.html',
  styleUrl: './tile-add-form.component.scss',
})
export class ViamTileAddFormComponent {
  @Input() options: readonly ViamSelectOption[] = [];
  @Input() value = '';
  @Input({ transform: booleanAttribute }) disabled = false;

  @Output() valueChange = new EventEmitter<string>();
  @Output() tileAdded = new EventEmitter<string>();

  onValueChange(value: string): void {
    this.value = value;
    this.valueChange.emit(value);
  }

  onSubmit(event: SubmitEvent): void {
    event.preventDefault();

    if (!this.disabled) {
      this.tileAdded.emit(this.value);
    }
  }
}
