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

import { ViamSegmentButtonComponent } from '../segment-button/segment-button.component';

@Component({
  selector: 'viam-segmented-control',
  standalone: true,
  imports: [ViamSegmentButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './segmented-control.component.html',
  host: {
    class: 'segmented',
    role: 'group',
    '[attr.aria-label]': 'ariaLabel || null',
  },
  styleUrl: './segmented-control.component.scss',
})
export class ViamSegmentedControlComponent {
  @Input() options: readonly ViamSelectOption[] = [];
  @Input() value = '';
  @Input() ariaLabel = '';

  @Output() valueChange = new EventEmitter<string>();
}
