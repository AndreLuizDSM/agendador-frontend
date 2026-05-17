import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Auth } from './auth.services';
import { Router } from '@angular/router';
import { CepResponse, EnderecoPayload, EnderecoResponse, TelefonePayload, TelefoneResponse, UserLoginPayload, UserRegisterPayload, UserResponse } from '../shared/components/interfaces';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class User {

  private apiUrl = environment.apiURL //TODO colocar em um .ENV
  private jwtService = new JwtHelperService;

  private _user = signal<UserResponse | null>(null);
  readonly user = this._user.asReadonly();

  constructor(private http: HttpClient, private authService: Auth, private router: Router) {
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

  getEmailByToken(token: string): string | null {
    try {
      const decoded = this.jwtService.decodeToken(token);
      return decoded?.sub || null;
    } catch (error) {
      console.log(error)
      return null
    }
  }

  //http://localhost:8083/usuario?email=andre%40gmail.com
  getUserByEmail(token: string): Observable<UserResponse> {

    const email = this.getEmailByToken(token);
    if (!email) throw new Error('Token inválido');

    const headers = new HttpHeaders({ Authorization: `${token}` })

    return this.http.get<UserResponse>(`${this.apiUrl}/usuario?email=${email}`, { headers })

  }

  getEnderecoByCep(cep: string): Observable<CepResponse> {

    return this.http.get<CepResponse>(`${this.apiUrl}/usuario/endereco/${cep}`)
  }

  saveTelefone(body: TelefonePayload, token: string): Observable<UserResponse> {
    const email = this.getEmailByToken(token);
    if (!email) throw new Error('Token inválido');

    return this.http.post<TelefoneResponse>(`${this.apiUrl}/usuario/telefone`, body, { headers: this.authService.getHeaders() }).pipe(
      switchMap(() => this.getUserByEmail(token)),
      tap(user => {
        this.setUser(user)
        this.authService.saveUser(user)
      })
    )
  }
  updateTelefone(id: number, body: TelefonePayload, token: string): Observable<UserResponse> {

    return this.http.put<TelefoneResponse>(`${this.apiUrl}/usuario/telefone?id=${id}`, body, { headers: this.authService.getHeaders() }).pipe(
      switchMap(() => this.getUserByEmail(token)),
      tap(user => {
        this.setUser(user)
        this.authService.saveUser(user)
      })
    )
  }

  saveEndereco(body: EnderecoPayload, token: string): Observable<UserResponse> {

    return this.http.post<EnderecoResponse>(`${this.apiUrl}/usuario/endereco`, body, { headers: this.authService.getHeaders() }).pipe(
      switchMap(() => this.getUserByEmail(token)),
      tap(user => {
        this.setUser(user)
        this.authService.saveUser(user)
      })
    )
  }

  updateEndereco(id: number, body: EnderecoPayload, token: string): Observable<UserResponse> {

    return this.http.put<EnderecoResponse>(`${this.apiUrl}/usuario/endereco?id=${id}`, body, { headers: this.authService.getHeaders() }).pipe(
      switchMap(() => this.getUserByEmail(token)),
      tap(user => {
        this.setUser(user)
        this.authService.saveUser(user)
      })
    )
  }

  logout(): void {
    this.authService.logout();
    this._user.set(null);
  }

  deleteUser(email: string): void {

    this.http.delete<void>(`${this.apiUrl}/usuario/${email}`, { headers: this.authService.getHeaders() }).subscribe(
      () => {
        this.authService.deleteToken(),
        this._user.set(null)
      }
    )
  }
}
