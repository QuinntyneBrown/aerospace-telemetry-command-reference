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
import { ViamFleetRowComponent } from '../fleet-row/fleet-row.component';
import { ViamIconButtonComponent } from '../icon-button/icon-button.component';
import { ViamMdCardComponent } from '../md-card/md-card.component';

@Component({
  selector: 'viam-fleet-table',
  standalone: true,
  imports: [
    ViamCardHeaderComponent,
    ViamFleetRowComponent,
    ViamIconButtonComponent,
    ViamMdCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fleet-table.component.html',
  styleUrl: './fleet-table.component.scss',
})
export class ViamFleetTableComponent {
  @Input() title = 'Fleet Watch';
  @Input() subtitle = '';
  @Input() rows: readonly ViamFleetRow[] = [];
  @Input({ transform: booleanAttribute }) showOpenAction = true;

  @Output() openFleet = new EventEmitter<MouseEvent>();
}
