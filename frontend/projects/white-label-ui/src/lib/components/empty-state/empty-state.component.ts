import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { type ViamAction } from '../../models';
import { ViamButtonComponent } from '../button/button.component';
import { ViamIconComponent } from '../icon/icon.component';

@Component({
  selector: 'viam-empty-state',
  standalone: true,
  imports: [ViamButtonComponent, ViamIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class ViamEmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = '';
  @Input() description = '';
  @Input() action: ViamAction | null = null;

  @Output() actionSelected = new EventEmitter<string>();
}
