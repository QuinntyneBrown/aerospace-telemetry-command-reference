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

import { ViamFleetCellComponent } from '../fleet-cell/fleet-cell.component';
import { ViamFleetUnitComponent } from '../fleet-unit/fleet-unit.component';
import { ViamStatusChipComponent } from '../status-chip/status-chip.component';
import { ViamStatusDotComponent } from '../status-dot/status-dot.component';

@Component({
  selector: 'viam-fleet-row',
  standalone: true,
  imports: [
    ViamFleetCellComponent,
    ViamFleetUnitComponent,
    ViamStatusChipComponent,
    ViamStatusDotComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fleet-row.component.html',
  host: {
    class: 'fleet-row',
  },
  styleUrl: './fleet-row.component.scss',
})
export class ViamFleetRowComponent {
  @Input() name = '';
  @Input() detail = '';
  @Input() state = '';
  @Input() battery = '';
  @Input() temperature = '';
  @Input() color = 'var(--viam-success, #4fe3a4)';
}
