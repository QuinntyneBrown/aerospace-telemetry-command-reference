import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NAVIGATION_ITEMS, TENANT_CONFIG } from '../../tokens';
import { SideNavigationComponent } from '../side-navigation/side-navigation.component';
import { TileGridComponent } from '../tile-grid/tile-grid.component';
import { TopAppBarComponent } from '../top-app-bar/top-app-bar.component';

@Component({
  selector: 'viam-dashboard-shell',
  standalone: true,
  imports: [SideNavigationComponent, TileGridComponent, TopAppBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-shell.component.html',
  styleUrl: './dashboard-shell.component.scss',
})
export class DashboardShellComponent {
  protected readonly tenant = inject(TENANT_CONFIG);
  protected readonly navigationItems = inject(NAVIGATION_ITEMS);
}
