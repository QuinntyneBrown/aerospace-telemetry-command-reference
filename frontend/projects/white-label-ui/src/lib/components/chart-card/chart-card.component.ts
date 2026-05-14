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
import { ViamChartBodyComponent } from '../chart-body/chart-body.component';
import { ViamIconButtonComponent } from '../icon-button/icon-button.component';
import { ViamMdCardComponent } from '../md-card/md-card.component';

@Component({
  selector: 'viam-chart-card',
  standalone: true,
  imports: [
    ViamCardHeaderComponent,
    ViamChartBodyComponent,
    ViamIconButtonComponent,
    ViamMdCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chart-card.component.html',
  styleUrl: './chart-card.component.scss',
})
export class ViamChartCardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() ariaLabel = '';
  @Input({ transform: booleanAttribute }) compact = false;
  @Input({ transform: booleanAttribute }) showCanvas = true;
  @Input({ transform: booleanAttribute }) showOptions = true;

  @Output() optionsClicked = new EventEmitter<MouseEvent>();
}
