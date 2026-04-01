import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Auth } from './auth';

// DTO Request
export interface UserRegisterPayload {
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
export interface UserResponse {
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

export interface UserLoginPayload {
  email: string,
  senha: string,
}

@Injectable({
  providedIn: 'root',
})
export class User {

  private apiUrl = 'http://localhost:8083'
  private jwtService = new JwtHelperService;

  private _user = signal<UserResponse | null>(null);
  readonly user = this._user.asReadonly();

  constructor(private http: HttpClient, private authService: Auth) {
    const usuarioSalvo = authService.getUser();
    if (usuarioSalvo) {
      this.setUser(usuarioSalvo);
    }
  }

  getUser(): UserResponse | null {
    return this.user();
  }

  setUser(data: UserResponse | null): void {
    this._user.set(data);
  }
  
  register(body: UserRegisterPayload): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/usuario`, body)
  }

  login(body: UserLoginPayload): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/usuario/login`, body, { responseType: 'text' as 'json' })
  }

  //http://localhost:8083/usuario?email=andre%40gmail.com
  getUserByEmail(token: string): Observable<UserResponse> {

    const email = this.getEmailByToken(token);
    if (!email) throw new Error('Token inválido');

    const headers = new HttpHeaders({ Authorization: `${token}` })

    return this.http.get<UserResponse>(`${this.apiUrl}/usuario?email=${email}`, { headers })

  }

  getEmailByToken(token: string): string | null {
    try {
      const decoded = this.jwtService.decodeToken(token);
      return decoded?.sub || null;
    } catch (error) {
      console.log(error)
      return null
    }
  }

  saveTelefone(body: { numero: string, ddd: string }, token: string): Observable<any> {
    const email = this.getEmailByToken(token);
    if (!email) throw new Error('Token inválido');

    const headers = new HttpHeaders({ Authorization: `${token}` })

    return this.http.post<any>(`${this.apiUrl}/usuario/telefone`, body, { headers }).pipe(
      switchMap(() => this.getUserByEmail(token)),
      tap(user => {
        this.setUser(user)
        this.authService.saveUser(user)    
      }) 
    )
  }
}
