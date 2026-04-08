import { Component, Inject, inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User, UserResponse } from '../../services/user';
import { email } from '@angular/forms/signals';
import { DialogFields, ModalDialog } from '../../shared/components/modal-dialog/modal-dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Auth } from '../../services/auth';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-user-data',
  imports: [MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule
  ],
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
      error: () => console.log('Erro ao buscarEnderecoPeloCep')

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
          callback: (cep:string) => this.buscarEnderecoPeloCep(cep, dialogRef)
        }
      },
      { name: 'rua', label: 'Rua', validators: [Validators.required] },
      { name: 'numero', label: 'Numero' },
      { name: 'cidade', label: 'Cidade', validators: [Validators.required]},
      { name: 'estado', label: 'Estado', validators: [Validators.required , Validators.maxLength(2)]},
      { name: 'complemento', label: 'Complemento'},
    ]

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Adicionar endereço', formConfig: formConfig },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.saveEndereco(result, token).subscribe({
          next: () => console.log('Cadastro com sucesso', result),
          error: (erro) => console.log('Erro', result, erro)
        })
      };
    });
  }

  editarEndereco(endereco: {
    id: number,
    rua: string,
    numero: number,
    complemento: string,
    cidade: string,
    estado: string,
    cep: string
  }) {

    const token = this.authService.getToken();
    if (!token) return;


    const formConfig: DialogFields[] = [
      {
        name: 'cep', label: 'CEP', value: endereco.cep, validators: [Validators.required],
        button: {
          icon: 'search',
          callback: (cep:string) => this.buscarEnderecoPeloCep(cep, dialogRef)
        }
      },
      { name: 'rua', label: 'Rua', value: endereco.rua, validators: [Validators.required] },
      { name: 'numero', label: 'Numero', value: endereco.numero, type: 'number' },
      { name: 'cidade', label: 'Cidade', value: endereco.cidade, validators: [Validators.required] },
      { name: 'estado', label: 'Estado', value: endereco.estado, validators: [Validators.required, Validators.maxLength(2)] },
      { name: 'complemento', label: 'Complemento', value: endereco.complemento},
    ]

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Editar telefone', formConfig: formConfig },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateEndereco(endereco.id, result, token).subscribe({
          next: () => console.log('Endereco editado', result),
          error: () => console.log('Erro', result)
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
          next: () => console.log('Telefone cadastrado', result),
          error: () => console.log('Erro', result)
        });
      };
    });
  }
  editarTelefone(telefone: { id: number, ddd: string, numero: string }) {

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
          next: () => console.log('Telefone editado', result),
          error: () => console.log('Erro', result)
        });
      };
    });
  }
}
