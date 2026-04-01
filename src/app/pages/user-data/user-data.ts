import { Component, Inject, inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User, UserResponse } from '../../services/user';
import { email } from '@angular/forms/signals';
import { DialogFields, ModalDialog } from '../../shared/components/modal-dialog/modal-dialog';
import { MatDialog } from '@angular/material/dialog';
import { Auth } from '../../services/auth';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-user-data',
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatListModule],
  templateUrl: './user-data.html',
  styleUrl: './user-data.scss',
  encapsulation: ViewEncapsulation.None
})
export class UserData {

  private formBuilder = inject(FormBuilder);
  private userService = inject(User);
  private authService = inject(Auth);
  readonly dialog = inject(MatDialog);

  user = this.userService.user;

  form = this.formBuilder.group({
    nome: [{ value: this.user()?.nome || '', disabled: true }],
    email: [{ value: this.user()?.email || '', disabled: true }]
  })

  cadastrarEndereco() {

      const formConfig: DialogFields[] = [
        { name: 'cep', label: 'CEP', validators: [Validators.required] },
        { name: 'rua', label: 'Rua' },
        { name: 'numero', label: 'Numero' },
        { name: 'cidade', label: 'Cidade' },
        { name: 'estado', label: 'Estado' },
        { name: 'complemento', label: 'Complemento' },
      ]

      const dialogRef = this.dialog.open(ModalDialog, {
        data: { title: 'Adicionar endereço', formConfig: formConfig },
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('Cadastro endereço: ', result);
      });
    }

  cadastrarTelefone() {

      const token = this.authService.getToken();
      if (!token) return;

      const formConfig: DialogFields[] = [
        { name: 'ddd', label: 'DDD', validators: [Validators.required] },
        { name: 'numero', label: 'Numero', validators: [Validators.required] },
      ]

      const dialogRef = this.dialog.open(ModalDialog, {
        data: { title: 'Adicionar telefone', formConfig: formConfig },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.userService.saveTelefone(result, token).subscribe({
            next: () => console.log('Telefone cadastrado', result),
            error: () => console.log('Erro', result)
          });
        };
      });
    }
  }
