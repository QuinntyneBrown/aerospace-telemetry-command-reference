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
  selector: 'viam-status-pill',
  standalone: true,
  imports: [ViamIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './status-pill.component.html',
  host: {
    class: 'status-pill',
    '[attr.data-tone]': 'tone',
  },
  styleUrl: './status-pill.component.scss',
})
export class ViamStatusPillComponent {
  @Input() label = '';
  @Input() icon = 'radio_button_checked';
  @Input() tone: ViamTone = 'success';
}
