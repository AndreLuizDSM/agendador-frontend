import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Auth } from './auth.services';
import { map, Observable, switchMap, tap } from 'rxjs';
import { User } from './user.services';
import { TaskPayLoad, TaskResponse } from '../shared/components/interfaces';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TasksServices {

  private apiUrl = environment.apiUrl //TODO colocar em um .ENV
  private _task = signal<TaskResponse[] | null>(null);
  readonly task = this._task.asReadonly();


  constructor(private http: HttpClient,
    private authService: Auth,
    private userService: User
  ) {
    this.getTask();
  }
  setTask(data: TaskResponse[] | null): void {
    this._task.set(data);
  }

  getTask(): void {
    this.http.get<TaskResponse[]>(`${this.apiUrl}/tarefas`, { headers: this.authService.getHeaders() })
      .subscribe({
        next: tasks => this._task.set(tasks),
        error: () => this._task.set([])
      })
  }

  createTask(body: TaskPayLoad): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(`${this.apiUrl}/tarefas`, body, { headers: this.authService.getHeaders() })
  }

  updateTask(body: {
    nomeTarefa: string,
    descricao: string,
    dataEvento: string,
  }, id: string): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(`${this.apiUrl}/tarefas?id=${id}`, body, { headers: this.authService.getHeaders() })
    //  .pipe(tap(task => { this.getTask() }))
  }

  deleteTask(id: string): Observable<TaskResponse> {
    return this.http.delete<TaskResponse>(`${this.apiUrl}/tarefas?id=${id}`, { headers: this.authService.getHeaders() })
      .pipe(tap(task => { this.getTask() }))
  }
}
