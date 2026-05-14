import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { type ViamMapNode, ViamSiteMapComponent } from 'white-label-ui';

import { type DashboardTileDefinition } from '../../models';

@Component({
  selector: 'viam-platform-operating-area-tile',
  standalone: true,
  imports: [ViamSiteMapComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './operating-area-tile.component.html',
  styleUrl: './operating-area-tile.component.scss',
})
export class OperatingAreaTileComponent {
  @Input({ required: true }) definition!: DashboardTileDefinition;

  protected get subtitle(): string {
    return (
      (this.definition.metadata?.['subtitle'] as string | undefined) ??
      'Mission corridor and active machines'
    );
  }

  protected get meta(): string {
    return (this.definition.metadata?.['meta'] as string | undefined) ?? '';
  }

  protected get nodes(): readonly ViamMapNode[] {
    return (this.definition.metadata?.['nodes'] as readonly ViamMapNode[] | undefined) ?? [];
  }
}
