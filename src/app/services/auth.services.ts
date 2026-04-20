import { Injectable } from '@angular/core';
import { User, UserResponse } from './user.services';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Auth {

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
  
  isLoggedIn(): boolean {

    return !!this.getToken();  // !! -> Retorna valor boolean do método
  }
}
