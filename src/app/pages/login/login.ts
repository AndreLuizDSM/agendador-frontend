import { ChangeDetectorRef, Component, signal, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { PasswordField } from '../../shared/components/password-field/password-field';
import { User } from '../../services/user.services';
import { Router } from '@angular/router';
import { email } from '@angular/forms/signals';
import { finalize } from 'rxjs';
import { Auth } from '../../services/auth.services';
import { UserLoginPayload } from '../../shared/components/interfaces';

@Component({
  selector: 'app-login',
  imports: [MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    PasswordField,
    ReactiveFormsModule,
    MatProgressSpinnerModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  encapsulation: ViewEncapsulation.None
})
export class Login {
  form: FormGroup<{ email: FormControl<string>, senha: FormControl<string> }>;
  isLoading = signal<boolean>(false);

  constructor(
    private formBuilder: FormBuilder,
    private userService: User,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private auth: Auth
  ) {

    this.form = formBuilder.group({
      email: this.formBuilder.control('', { validators: [Validators.required, Validators.email], nonNullable: true }),
      senha: this.formBuilder.control('', { validators: [Validators.required, Validators.minLength(6)], nonNullable: true })
    })
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/tasks'])
    }

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

    const formData = this.form.value as UserLoginPayload;

    this.isLoading.set(true);

    this.userService.login(formData)
      .pipe(finalize(() => { this.isLoading.set(false)}))
      .subscribe({
        next: (response) => {
          this.auth.saveToken(response);
          this.userService.getUserByEmail(response).subscribe({
            next: (user) => {
              this.auth.saveUser(user);
              this.router.navigate(['/tasks']);
              this.userService.setUser(user);
            }
          });
        },
        error: (error) => {
          console.log('Erro ao fazer login', error)
        }
      });
  }
}
