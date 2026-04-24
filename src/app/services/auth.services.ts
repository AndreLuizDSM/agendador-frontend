import { Injectable } from '@angular/core';
import { User, UserResponse } from './user.services';
import { HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private jwtService = new JwtHelperService;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER = 'logged_user';

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  saveUser(user: UserResponse): void {

    localStorage.setItem(this.USER, JSON.stringify(user));
  }

  getExpirationTimeByToken(token: string): Date | null{
    try {
    const decoded = this.jwtService.decodeToken(token);
    if(!decoded.exp) return null
    
    return new Date(decoded.exp * 1000)
    } catch(error){
      console.log(error)
      return null
    }
  
  }
  
  getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({ Authorization: `${token}` });
  }

  getUser(): UserResponse | null {
    const user = localStorage.getItem(this.USER)
    if (!user) return null

    return JSON.parse(user) as UserResponse;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isTokenExpired(token: string): boolean{
    const tokenExp = this.jwtService.decodeToken(token)
    if (!tokenExp) return true; // Se não tiver token, trata como se tivesse expirado

    const dataAtual = Math.floor(Date.now() / 1000)
    return dataAtual > tokenExp.exp // Se dataAtual for maior, retorna true
  }
  
  isLoggedIn(): boolean {
    const token = this.getToken();
    if(!token) return false
   
      return  !this.isTokenExpired(token);  // !! -> Retorna valor boolean do método
  }
}
