import { Component, inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../services/user.services';
import { Auth } from '../../services/auth.services';
import { MatDialog } from '@angular/material/dialog';
import { ModalDialog } from '../../shared/components/modal-dialog/modal-dialog';
import { TasksServices } from '../../services/tasks.services';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { ConfirmModalDialog } from '../../shared/components/confirm-modal-dialog/confirm-modal-dialog';
import { Router } from '@angular/router';
import { DialogFields } from '../../shared/components/interfaces';

@Component({
  selector: 'app-tasks',
  imports: [MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tasks {

  private formBuilder = inject(FormBuilder);
  private taskService = inject(TasksServices);
  private authService = inject(Auth);
  private router = inject(Router);

  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.authService.logout();
      this.router.navigate([''])
    }
  }

  tasks = this.taskService.task;
  hasTasks = () => (this.tasks() ?? []).length > 0

  separarDataEvento(dataEvento: string) {
    //Método para preencher formConfig
    
    const [data, tempo] = dataEvento.split(' ')
    const [dia, mes, ano] = data.split('-').map(Number);
    const [horas, minutos, segundos] = tempo.split(':').map(Number);

    const tempoFormatado = new Date(ano, mes - 1, dia, horas, minutos);

    return tempoFormatado;
  }

  dataString(dataEvento: string) {
    const [data, tempo] = dataEvento.split(' ')
    const [dia, mes, ano] = data.split('-');
    const [horas, minutos, segundos] = tempo.split(':');

    const dataString = `${dia}/${mes}/${ano}`
    const tempoString = `${horas}:${minutos}`

    return { dataString, tempoString };
  }

  adicionarTarefa(): void {
    const formConfig: DialogFields[] = [
      { name: 'nomeTarefa', label: 'Nome da tarefa', validators: [Validators.required, Validators.maxLength(35)] },
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

        const formatter = (n: number) => n.toString().padStart(2, "0");

        const ano = data.getFullYear();
        const mes = formatter(data.getMonth() + 1);
        const dia = formatter(data.getDate());

        const hora = formatter(tempo.getHours());
        const minuto = formatter(tempo.getMinutes());
        const segundo = formatter(tempo.getSeconds());

        // dd-MM-yyyy HH:mm:ss

        const dataEvento = (`${dia}-${mes}-${ano} ${hora}:${minuto}:${segundo}`);
        const payload = {
          ...resto,
          dataEvento
        }
        this.taskService.createTask(payload)
          .pipe(finalize(() => { this.taskService.getTask() }))
          .subscribe({
            next: () => { },
            error: () => { }
          });
      };
    });
  }

  editarTarefa(tarefa: {
    id: string,
    nomeTarefa: string,
    descricao: string,
    dataCriacao: string,
    dataEvento: string,
    emailUsuario: string,
    dataAlteracao: string,
  }): void {

    const tempoFormatado = this.separarDataEvento(tarefa.dataEvento);

    const formConfig: DialogFields[] = [
      { name: 'nomeTarefa', label: 'Nome da tarefa', value: tarefa.nomeTarefa, validators: [Validators.required, Validators.maxLength(35)] },
      { name: 'data', label: 'Dia', type: 'date', value: tempoFormatado, validators: [Validators.required] },
      { name: 'tempo', label: 'Hora da tarefa', type: 'time', value: tempoFormatado, validators: [Validators.required] },
      { name: 'descricao', label: 'Descrição', type: 'textarea', value: tarefa.descricao, validators: [Validators.required] },
    ]

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Editar tarefa', formConfig: formConfig },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const formatter = (n: number) => n.toString().padStart(2, "0");
        const { data, tempo, ...resto } = result;
        const ano = data.getFullYear();
        const mes = formatter(data.getMonth() + 1);
        const dia = formatter(data.getDate());

        const hora = formatter(tempo.getHours());
        const minuto = formatter(tempo.getMinutes());
        const segundo = formatter(tempo.getSeconds());

        // // dd-MM-yyyy HH:mm:ss

        const dataEvento = (`${dia}-${mes}-${ano} ${hora}:${minuto}:${segundo}`);
        const payload = {
          ...resto,
          dataEvento,
        }

        this.taskService.updateTask(payload, tarefa.id)
          .pipe(finalize(() => { this.taskService.getTask() }))
          .subscribe({
            next: () => {
            },
            error: () => { }
          });
      };
    });
  }

  deletarTarefa(tarefa: string): void {

    const dialogRef = this.dialog.open(ConfirmModalDialog, {
      data: {
        title: 'Deletar tarefa',
        message: 'Tem certeza que deseja excluir tarefa ?',
        confirmButton: 'Deletar',
        cancelButton: 'Cancelar'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.taskService.deleteTask(tarefa)
          .pipe(finalize(() => { this.taskService.getTask() }))
          .subscribe({
            next: () => { },
            error: () => { }
          });
      };
    });
  }
}
