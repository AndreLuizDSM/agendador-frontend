import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'input-password-field',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule],
  templateUrl: './password-field.html',
  styleUrl: './password-field.scss',
})
export class PasswordField {
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  @Input({ required: true }) control!: FormControl;
  @Input() placeHolder: string = "Digite sua senha";

  get passwordError(): string | null {
    const passwordControl = this.control
    if (passwordControl?.hasError('required')) return 'Campo obrigatório*';
    if (passwordControl?.hasError('minlength')) return 'Senha deve ter mínimo 6 digitos';
    return null
  }
}
