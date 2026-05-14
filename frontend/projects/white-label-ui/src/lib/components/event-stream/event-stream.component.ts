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

import { ViamCardHeaderComponent } from '../card-header/card-header.component';
import { ViamEventListComponent } from '../event-list/event-list.component';
import { ViamEventRowComponent } from '../event-row/event-row.component';
import { ViamIconButtonComponent } from '../icon-button/icon-button.component';
import { ViamMdCardComponent } from '../md-card/md-card.component';

@Component({
  selector: 'viam-event-stream',
  standalone: true,
  imports: [
    ViamCardHeaderComponent,
    ViamEventListComponent,
    ViamEventRowComponent,
    ViamIconButtonComponent,
    ViamMdCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-stream.component.html',
  styleUrl: './event-stream.component.scss',
})
export class ViamEventStreamComponent {
  @Input() title = 'Event Stream';
  @Input() subtitle = 'Latest machine and operator events';
  @Input() events: readonly ViamEventItem[] = [];
  @Input({ transform: booleanAttribute }) showFilterAction = true;

  @Output() filterClicked = new EventEmitter<MouseEvent>();
}
