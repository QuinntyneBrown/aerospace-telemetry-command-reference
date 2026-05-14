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
import { ViamMapLaneComponent } from '../map-lane/map-lane.component';
import { ViamMapNodeComponent } from '../map-node/map-node.component';
import { ViamMapOrbitComponent } from '../map-orbit/map-orbit.component';
import { ViamMdCardComponent } from '../md-card/md-card.component';

@Component({
  selector: 'viam-site-map',
  standalone: true,
  imports: [
    ViamCardHeaderComponent,
    ViamMapLaneComponent,
    ViamMapNodeComponent,
    ViamMapOrbitComponent,
    ViamMdCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-map.component.html',
  styleUrl: './site-map.component.scss',
})
export class ViamSiteMapComponent {
  @Input() title = 'Operating Area';
  @Input() subtitle = 'Mission corridor and active machines';
  @Input() meta = '';
  @Input() ariaLabel = '';
  @Input() nodes: readonly ViamMapNode[] = [];
}
