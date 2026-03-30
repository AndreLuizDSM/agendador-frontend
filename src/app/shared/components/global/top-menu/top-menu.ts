import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { filter, Subscription } from 'rxjs';
import { RouterState } from '../../../../core/router/router-state';
import { Auth } from '../../../../services/auth';
import {MatMenuModule} from '@angular/material/menu';
import { User } from '../../../../services/user';

@Component({
  selector: 'app-top-menu',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, MatMenuModule],
  templateUrl: './top-menu.html',
  styleUrl: './top-menu.scss',
})
export class TopMenu implements OnInit, OnDestroy {
  
  
  logoApp = 'assets/Logo-Mny.png';

  rotaAtual: string = '';
  inscricaoAtual!: Subscription;
 
  private userService = inject(User);
  private authService = inject(Auth);
  private routerService = inject(RouterState);
  
  ngOnInit(): void {
    this.inscricaoAtual = this.routerService.atualRota$.subscribe(
      url => this.rotaAtual = url
    );
  }

  ngOnDestroy(): void {
    this.inscricaoAtual.unsubscribe(); //Memory Leak
  }

  isOnRegister(): boolean {
    return this.rotaAtual ==='/register'
  }
  isOnLogin(): boolean {
    return this.rotaAtual ==='/login'
  }

  get isLogged(): boolean {
    return this.authService.isLoggedIn();
  }

  inicialDoNome(): string | null{
    const user = this.userService.getUser();
    if (user && user.nome) return user?.nome.charAt(0).toLocaleUpperCase()
    return "?";
  }
  
  logout(): void {
    this.authService.logout();
  }
}
