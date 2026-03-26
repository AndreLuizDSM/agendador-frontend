import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


// DTO Request
interface UserRegisterPayload {
  nome: string,
  email: string,
  senha: string,
  enderecos?: [{  // ? -> Pode não existir e retornar nada
    rua: string,
    numero: number,
    complemento: string,
    cidade: string,
    estado: string,
    cep: string
  }],
  telefones?: [{
    ddd: string,
    numero: string
  }]

}

// Dto Response
interface UserRegisterResponse {
  nome: string,
  email: string,
  enderecos: [{
    rua: string,
    numero: number,
    complemento: string,
    cidade: string,
    estado: string,
    cep: string
  }] | null,  // -> Me retorna null
  telefones: [{
    ddd: string,
    numero: string
  }] | null
}

@Injectable({
  providedIn: 'root',
})
export class User {

  private apiUrl = 'http://localhost:8083/'

  constructor(private http: HttpClient) {
  }

  register(body: UserRegisterPayload): Observable<UserRegisterResponse> {
    return this.http.post<UserRegisterResponse>(`${this.apiUrl}usuario`, body)
  }
}
