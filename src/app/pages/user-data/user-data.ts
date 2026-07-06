import { Component, Inject, inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../services/user.services';
import { email } from '@angular/forms/signals';
import { ModalDialog } from '../../shared/components/modal-dialog/modal-dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Auth } from '../../services/auth.services';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, ɵEmptyOutletComponent } from '@angular/router';
import { ConfirmModalDialog } from '../../shared/components/confirm-modal-dialog/confirm-modal-dialog';
import { finalize } from 'rxjs';
import { DialogFields, EnderecoResponse, TelefoneResponse } from '../../shared/components/interfaces';

@Component({
  selector: 'app-user-data',
  imports: [MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule],
  templateUrl: './user-data.html',
  styleUrl: './user-data.scss',
  encapsulation: ViewEncapsulation.None
})
export class UserData {

  private formBuilder = inject(FormBuilder);
  private userService = inject(User);
  private authService = inject(Auth);
  private router = inject(Router);
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.authService.logout()
      this.router.navigate([''])
    }
  }

  user = this.userService.user;

  form = this.formBuilder.group({
    nome: [{ value: this.user()?.nome || '', disabled: true }],
    email: [{ value: this.user()?.email || '', disabled: true }]
  })

  buscarEnderecoPeloCep(cep: string, dialogRef: MatDialogRef<ModalDialog, any>) {
    this.userService.getEnderecoByCep(cep).subscribe({
      next: (response) => {
        dialogRef.componentInstance.form.patchValue({
          rua: response.logradouro,
          complemento: response.complemento,
          cidade: response.localidade,
          estado: response.uf
        })
      },
      error: () => { }

    })
  }

  cadastrarEndereco() {
    const token = this.authService.getToken();
    if (!token) return;

    const formConfig: DialogFields[] = [
      {
        name: 'cep', label: 'CEP', validators: [Validators.required],
        button: {
          icon: 'search',
          callback: (cep: string) => this.buscarEnderecoPeloCep(cep, dialogRef)
        }
      },
      { name: 'rua', label: 'Rua', validators: [Validators.required] },
      { name: 'numero', label: 'Numero' },
      { name: 'cidade', label: 'Cidade', validators: [Validators.required] },
      { name: 'estado', label: 'Estado', validators: [Validators.required, Validators.maxLength(2)] },
      { name: 'complemento', label: 'Complemento' , validators: [Validators.maxLength(10)]},
    ]

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Adicionar endereço', formConfig: formConfig },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.saveEndereco(result, token).subscribe({
          next: () => { },
          error: () => { }
        })
      };
    });
  }

  editarEndereco(endereco: EnderecoResponse) {

    const token = this.authService.getToken();
    if (!token) return;


    const formConfig: DialogFields[] = [
      {
        name: 'cep', label: 'CEP', value: endereco.cep, validators: [Validators.required],
        button: {
          icon: 'search',
          callback: (cep: string) => this.buscarEnderecoPeloCep(cep, dialogRef)
        }
      },
      { name: 'rua', label: 'Rua', value: endereco.rua, validators: [Validators.required] },
      { name: 'numero', label: 'Numero', value: endereco.numero, type: 'number' },
      { name: 'cidade', label: 'Cidade', value: endereco.cidade, validators: [Validators.required] },
      { name: 'estado', label: 'Estado', value: endereco.estado, validators: [Validators.required, Validators.maxLength(2)] },
      { name: 'complemento', label: 'Complemento', value: endereco.complemento },
    ]

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Editar telefone', formConfig: formConfig },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateEndereco(endereco.id, result, token).subscribe({
          next: () => { },
          error: () => { }
        });
      };
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
          next: () => { },
          error: () => { }
        });
      };
    });
  }

  editarTelefone(telefone: TelefoneResponse) {

    const token = this.authService.getToken();
    if (!token) return;


    const formConfig: DialogFields[] = [
      { name: 'ddd', label: 'DDD', value: telefone.ddd, validators: [Validators.required] },
      { name: 'numero', label: 'Numero', value: telefone.numero, validators: [Validators.required] },
    ]

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Editar telefone', formConfig: formConfig },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateTelefone(telefone.id, result, token).subscribe({
          next: () => { },
          error: () => { }
        });
      };
    });
  }

  deletarUsuario(email: string | undefined): void {
    if (!email) return

    const dialogRef = this.dialog.open(ConfirmModalDialog, {
      data: {
        title: 'Apagar usuário',
        message: 'Deseja deletar usuário ?',
        confirmButton: 'Deletar',
        cancelButton: 'Cancelar'
      }
    })

    dialogRef.afterClosed()
    .subscribe(result => {
      if (result) {

        this.userService.deleteUser(email)
        this.router.navigate([''])
        
        
      }
    })
  }
}
