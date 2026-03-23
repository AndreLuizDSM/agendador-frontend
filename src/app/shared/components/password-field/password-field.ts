import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'input-password-field',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './password-field.html',
  styleUrl: './password-field.scss',
})
export class PasswordField {
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}
