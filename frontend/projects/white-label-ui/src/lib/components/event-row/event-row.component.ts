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

import { ViamEventIconComponent } from '../event-icon/event-icon.component';
import { ViamEventTimeComponent } from '../event-time/event-time.component';

@Component({
  selector: 'viam-event-row',
  standalone: true,
  imports: [ViamEventIconComponent, ViamEventTimeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-row.component.html',
  host: {
    class: 'event-row',
  },
  styleUrl: './event-row.component.scss',
})
export class ViamEventRowComponent {
  @Input() icon = 'monitoring';
  @Input() title = '';
  @Input() detail = '';
  @Input() time = '';
  @Input() color = 'var(--viam-info, #8be7ff)';
}
