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

import { ViamCardTitleComponent } from '../card-title/card-title.component';
import { ViamCommandButtonComponent } from '../command-button/command-button.component';
import { ViamCommandFooterComponent } from '../command-footer/command-footer.component';
import { ViamCommandGridComponent } from '../command-grid/command-grid.component';
import { ViamFilledTonalButtonComponent } from '../filled-tonal-button/filled-tonal-button.component';
import { ViamKeyValueGroupComponent } from '../key-value-group/key-value-group.component';
import { ViamKeyValueItemComponent } from '../key-value-item/key-value-item.component';
import { ViamMdCardComponent } from '../md-card/md-card.component';

@Component({
  selector: 'viam-command-center',
  standalone: true,
  imports: [
    ViamCardTitleComponent,
    ViamCommandButtonComponent,
    ViamCommandFooterComponent,
    ViamCommandGridComponent,
    ViamFilledTonalButtonComponent,
    ViamKeyValueGroupComponent,
    ViamKeyValueItemComponent,
    ViamMdCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './command-center.component.html',
  styleUrl: './command-center.component.scss',
})
export class ViamCommandCenterComponent {
  @Input() title = 'Command Center';
  @Input() subtitle = 'Signed commands require operator approval';
  @Input() commands: readonly ViamCommandAction[] = [];
  @Input() keyValues: readonly ViamKeyValueItem[] = [];
  @Input() armLabel = 'Arm';
  @Input({ transform: booleanAttribute }) showArmAction = true;

  @Output() commandSelected = new EventEmitter<string>();
  @Output() armClicked = new EventEmitter<MouseEvent>();
}
