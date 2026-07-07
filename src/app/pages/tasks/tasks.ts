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

  private readonly pad = (n: number) => n.toString().padStart(2, '0');

  // Junta a data + hora escolhidas no dialog (horário local, GMT-3) e devolve a
  // string em UTC no formato dd-MM-yyyy HH:mm:ss. Assim o LocalDateTime do
  // back-end guarda o instante já em UTC (ex.: 11:00 local -> 14:00 UTC).
  private toDataEventoUtc(data: Date, tempo: Date): string {
    const instante = new Date(
      data.getFullYear(), data.getMonth(), data.getDate(),
      tempo.getHours(), tempo.getMinutes(), tempo.getSeconds()
    );

    const dia = this.pad(instante.getUTCDate());
    const mes = this.pad(instante.getUTCMonth() + 1);
    const ano = instante.getUTCFullYear();
    const hora = this.pad(instante.getUTCHours());
    const minuto = this.pad(instante.getUTCMinutes());
    const segundo = this.pad(instante.getUTCSeconds());

    return `${dia}-${mes}-${ano} ${hora}:${minuto}:${segundo}`;
  }

  // Converte a string UTC vinda do back-end (dd-MM-yyyy HH:mm:ss) para um Date
  // local, de forma que getHours()/getDate() já devolvam o horário de parede
  // correto (ex.: 14:00 UTC -> 11:00 local).
  private parseDataEventoUtc(dataEvento: string): Date {
    const [data, tempo] = dataEvento.split(' ');
    const [dia, mes, ano] = data.split('-').map(Number);
    const [horas, minutos, segundos] = tempo.split(':').map(Number);

    return new Date(Date.UTC(ano, mes - 1, dia, horas, minutos, segundos));
  }

  separarDataEvento(dataEvento: string) {
    //Método para preencher formConfig
    return this.parseDataEventoUtc(dataEvento);
  }

  dataString(dataEvento: string) {
    const d = this.parseDataEventoUtc(dataEvento);

    const dataString = `${this.pad(d.getDate())}/${this.pad(d.getMonth() + 1)}/${d.getFullYear()}`
    const tempoString = `${this.pad(d.getHours())}:${this.pad(d.getMinutes())}`

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

        const dataEvento = this.toDataEventoUtc(data, tempo);
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
        const { data, tempo, ...resto } = result;

        const dataEvento = this.toDataEventoUtc(data, tempo);
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
