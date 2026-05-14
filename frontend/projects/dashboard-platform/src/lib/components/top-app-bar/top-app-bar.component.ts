import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  ViamBrandMarkComponent,
  ViamBrandMetaComponent,
  ViamStatusPillComponent,
} from 'white-label-ui';

import { type TenantConfig } from '../../models';

@Component({
  selector: 'viam-platform-top-app-bar',
  standalone: true,
  imports: [ViamBrandMarkComponent, ViamBrandMetaComponent, ViamStatusPillComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './top-app-bar.component.html',
  styleUrl: './top-app-bar.component.scss',
})
export class TopAppBarComponent {
  @Input({ required: true }) tenant!: TenantConfig;
}
