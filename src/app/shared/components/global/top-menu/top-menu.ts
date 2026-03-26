import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { filter, Subscription } from 'rxjs';
import { RouterState } from '../../../../core/router/router-state';

@Component({
  selector: 'app-top-menu',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './top-menu.html',
  styleUrl: './top-menu.scss',
})
export class TopMenu implements OnInit, OnDestroy {
  
  
  logoApp = 'assets/Logo-Mny.png';

  rotaAtual: string = '';
  inscricaoAtual!: Subscription;
 
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
}
