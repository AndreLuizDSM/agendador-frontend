import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from './auth.services';
import { Observable } from 'rxjs';
import { User } from './user.services';

interface TaskResponse {
  id: string,
  nomeTarefa: string,
  descricao: string,
  dataCriacao: string,
  dataEvento: string,
  emailUsuario: string,
  dataAlteracao: string,
  statusNotificacaoEnum: 'PENDENTE' | 'NOTIFICADO' | 'CANCELADO'
}

interface TaskPayLoad {
  nomeTarefa: string,
  descricao: string,
  dataEvento: string,
}

@Injectable({
  providedIn: 'root',
})
export class TasksServices {

  private apiUrl = 'http://localhost:8083' //TODO colocar em um .ENV

  constructor(private http: HttpClient,
    private authService: Auth,
  ) { }

  getTask(): Observable<TaskResponse[]> {

    return this.http.get<TaskResponse[]>(`${this.apiUrl}/tarefas`, { headers: this.authService.getHeaders() })
  }
  createTask(body: TaskPayLoad): Observable<TaskResponse> {
    const token = this.authService.getToken();
    if (!token) throw new Error('Token inválido')
    const headers = new HttpHeaders({ Authorization: `${token}` })

    return this.http.post<TaskResponse>(`${this.apiUrl}/tarefas`, body, { headers })
  }
}
