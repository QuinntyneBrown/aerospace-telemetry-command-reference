import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ViamRailNavComponent } from 'white-label-ui';

import { type NavigationItem } from '../../models';

@Component({
  selector: 'viam-platform-side-navigation',
  standalone: true,
  imports: [ViamRailNavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './side-navigation.component.html',
  styleUrl: './side-navigation.component.scss',
})
export class SideNavigationComponent {
  @Input() navigationItems: readonly NavigationItem[] = [];

  protected get railItems() {
    return this.navigationItems.map((item, index) => ({
      label: item.label,
      icon: item.icon || 'space_dashboard',
      value: item.id,
      active: index === 0,
      disabled: item.disabled,
    }));
  }
}
