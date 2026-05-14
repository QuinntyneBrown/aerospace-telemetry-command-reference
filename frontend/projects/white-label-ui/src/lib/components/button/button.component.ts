import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
} from '@angular/core';

import { type ViamButtonType } from '../../models';
import { ViamIconComponent } from '../icon/icon.component';

@Component({
  selector: 'viam-button',
  standalone: true,
  imports: [ViamIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ViamButtonComponent {
  @Input() icon = '';
  @Input() label = '';
  @Input() ariaLabel = '';
  @Input() type: ViamButtonType = 'button';
  @Input() variant: 'primary' | 'tonal' | 'ghost' | 'danger' = 'tonal';
  @Input({ transform: booleanAttribute }) disabled = false;

  @Output() clicked = new EventEmitter<MouseEvent>();
}
