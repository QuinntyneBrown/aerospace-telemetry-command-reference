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
  selector: 'viam-command-button',
  standalone: true,
  imports: [ViamIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './command-button.component.html',
  styleUrl: './command-button.component.scss',
})
export class ViamCommandButtonComponent {
  @Input() label = '';
  @Input() icon = '';
  @Input() value = '';
  @Input() color = 'var(--viam-info, #8be7ff)';
  @Input({ transform: booleanAttribute }) disabled = false;

  @Output() selected = new EventEmitter<string>();
}
