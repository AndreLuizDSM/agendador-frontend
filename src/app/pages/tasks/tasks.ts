import { Component, inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../services/user.services';
import { Auth } from '../../services/auth.services';
import { MatDialog } from '@angular/material/dialog';
import { DialogFields, ModalDialog } from '../../shared/components/modal-dialog/modal-dialog';
import { TasksServices } from '../../services/tasks.services';

@Component({
  selector: 'app-tasks',
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
  encapsulation: ViewEncapsulation.None
})
export class Tasks {

  private formBuilder = inject(FormBuilder);
  private taskService = inject(TasksServices);
  readonly dialog = inject(MatDialog);

  adicionarTarefa() {
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
        this.taskService.createTask(payload).subscribe({
          next: () => console.log('Task criada!', payload),
          error: () => console.log('Erro ao criar task', payload)
        });
      };
    });
  }
}
