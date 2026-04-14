import { Component, inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../services/user';
import { Auth } from '../../services/auth';
import { MatDialog } from '@angular/material/dialog';
import { DialogFields, ModalDialog } from '../../shared/components/modal-dialog/modal-dialog';

@Component({
  selector: 'app-tasks',
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
  encapsulation: ViewEncapsulation.None
})
export class Tasks {

  private formBuilder = inject(FormBuilder);
  private authService = inject(Auth);
  readonly dialog = inject(MatDialog);

  //TODO taskService para salvar e editar tasks

  adicionarTarefa() {
    const token = this.authService.getToken();
    if (!token) return;

    const formConfig: DialogFields[] = [
      { name: 'nomeTarefa', label: 'Nome da tarefa', validators: [Validators.required] },
      { name: 'data', label: 'Dia', type: 'date', validators: [Validators.required] },
      { name: 'tempo', label: 'Hora da tarefa', type: 'time', validators: [Validators.required] },
      { name: 'descricao', label: 'Descrição', type: 'textarea', validators: [Validators.required] },

    ]

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Adicionar tarefa', formConfig: formConfig },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { data, tempo, ...resto } = result;

        const ano = data.getFullYear();
        const mes = data.getMonth();
        const dia = data.getDate();

        const hora = tempo.getHours();
        const minuto = tempo.getMinutes();
        const segundo = tempo.getSeconds();

        const dataEvento = new Date(ano, mes, dia, hora, minuto, segundo).toISOString();
        const payload = {
          ...resto,
          dataEvento
        }

        
        console.log('Tarefa cadastrada ', payload)
        // this.userService.updateEndereco(endereco.id, result, token).subscribe({
        //   next: () => console.log('Endereco editado', result),
        //   error: () => console.log('Erro', result)
        // });
      };
    });
    //Fazer o afterClosed para adicionar no taskService.
  }
}
