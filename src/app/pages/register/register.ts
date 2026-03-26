import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PasswordField } from "../../shared/components/password-field/password-field";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../services/user';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    PasswordField,
    ReactiveFormsModule,
    MatProgressSpinnerModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  encapsulation: ViewEncapsulation.None
})
export class Register {
  form: FormGroup;
  isLoading = false;

  constructor
    (private formBuilder: FormBuilder,
      private userService: User,
      private router: Router,
      private cdr : ChangeDetectorRef // Resolver problema de atualização no DOM
    ) {

    this.form = formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(12)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  get fullNameError(): string | null {
    const fullNameControl = this.form.get('nome')
    if (fullNameControl?.hasError('required')) return 'Campo obrigatório*';
    if (fullNameControl?.hasError('minlength')) return 'Nome deve conter mais de 12 letras';
    return null
  }
  get emailError(): string | null {
    const emailControl = this.form.get('email')
    if (emailControl?.hasError('required')) return 'Campo obrigatório*';
    if (emailControl?.hasError('email')) return 'Email deve conter @';
    return null
  }

  get passwordControl(): FormControl {
    return this.form.get('senha') as FormControl;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return
    }

    const formData = this.form.value;

    this.isLoading = true;
    
    this.userService.register(formData)
    .pipe(finalize(() => {this.isLoading = false; this.cdr.markForCheck()} ))
    .subscribe({
        next: (response) => { console.log('Sucesso', response) },
        error: (error) => { console.log('Erro ao registrar usuário', error) }, 
      });
  }

}
