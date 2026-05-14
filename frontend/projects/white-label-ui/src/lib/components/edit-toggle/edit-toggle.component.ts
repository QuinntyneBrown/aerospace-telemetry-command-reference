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

import { ViamSwitchTrackComponent } from '../switch-track/switch-track.component';

@Component({
  selector: 'viam-edit-toggle',
  standalone: true,
  imports: [ViamSwitchTrackComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-toggle.component.html',
  styleUrl: './edit-toggle.component.scss',
})
export class ViamEditToggleComponent {
  @Input({ transform: booleanAttribute }) checked = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() label = 'Edit';
  @Input() ariaLabel = '';

  @Output() checkedChange = new EventEmitter<boolean>();

  onChange(event: Event): void {
    this.checkedChange.emit((event.target as HTMLInputElement).checked);
  }
}
