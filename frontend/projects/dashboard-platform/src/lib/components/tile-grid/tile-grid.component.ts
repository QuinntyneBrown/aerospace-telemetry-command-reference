import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  type ViamSelectOption,
  ViamDashboardTileComponent,
  ViamEditToggleComponent,
  ViamEmptyStateComponent,
  ViamTileAddFormComponent,
  ViamTileControlComponent,
  ViamTileEditControlsComponent,
  ViamTileSizeSelectComponent,
} from 'white-label-ui';

import { DASHBOARD_LAYOUT_PERSISTENCE_SERVICE, TILE_REGISTRY_SERVICE } from '../../contracts';
import {
  type DashboardLayout,
  type DashboardTileDefinition,
  type DashboardTilePlacement,
  type DashboardTileSize,
} from '../../models';
import { DASHBOARD_LAYOUT } from '../../tokens';

@Component({
  selector: 'viam-platform-tile-grid',
  standalone: true,
  imports: [
    NgComponentOutlet,
    ViamDashboardTileComponent,
    ViamEditToggleComponent,
    ViamEmptyStateComponent,
    ViamTileAddFormComponent,
    ViamTileControlComponent,
    ViamTileEditControlsComponent,
    ViamTileSizeSelectComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tile-grid.component.html',
  styleUrl: './tile-grid.component.scss',
})
export class TileGridComponent {
  private readonly baseLayout = inject(DASHBOARD_LAYOUT);
  private readonly registry = inject(TILE_REGISTRY_SERVICE);
  private readonly persistence = inject(DASHBOARD_LAYOUT_PERSISTENCE_SERVICE);

  protected readonly editMode = signal(false);
  protected readonly selectedTileId = signal(this.registry.getAvailableTiles()[0]?.id ?? '');
  protected readonly layout = signal(this.persistence.load(this.baseLayout));

  protected get tileOptions(): readonly ViamSelectOption[] {
    return this.registry.getAvailableTiles().map((tile) => ({
      label: tile.label,
      value: tile.id,
    }));
  }

  protected get orderedPlacements(): readonly DashboardTilePlacement[] {
    return [...this.layout().tiles].sort((first, second) => first.order - second.order);
  }

  protected setEditMode(value: boolean): void {
    this.editMode.set(value);
  }

  protected onSelectedTileChange(tileId: string): void {
    this.selectedTileId.set(tileId);
  }

  protected onTileAdded(tileId: string): void {
    if (!this.editMode()) {
      return;
    }

    const definition = this.registry.getTile(tileId);

    if (!definition) {
      return;
    }

    this.layout.set(this.persistence.addTile(this.layout(), definition.id, definition.defaultSize));
  }

  protected onTileRemoved(placementId: string): void {
    if (!this.editMode()) {
      return;
    }

    this.layout.set(this.persistence.removeTile(this.layout(), placementId));
  }

  protected onTileResized(placementId: string, size: DashboardTileSize): void {
    if (!this.editMode()) {
      return;
    }

    this.layout.set(this.persistence.resizeTile(this.layout(), placementId, size));
  }

  protected tileFor(placement: DashboardTilePlacement): DashboardTileDefinition | undefined {
    return this.registry.getTile(placement.tileId);
  }

  protected tileInputs(definition: DashboardTileDefinition): Record<string, unknown> {
    return { definition };
  }

  protected resetLayout(): void {
    if (!this.editMode()) {
      return;
    }

    this.layout.set(this.persistence.reset(this.baseLayout));
  }
}
