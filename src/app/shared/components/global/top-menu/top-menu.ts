import { Component, OnDestroy, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { filter, Subscription } from 'rxjs';

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

  constructor(private router: Router) {} // Injeção de dependência para acessar as rotas
  
  ngOnInit(): void {
    this.rotaAtual = this.router.url 
    this.inscricaoAtual = this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((evento: NavigationEnd) => {
      this.rotaAtual = evento.url
      console.log('Rota atual2: ', this.rotaAtual)})
  }

  ngOnDestroy(): void {
    this.inscricaoAtual.unsubscribe(); //Memory Leak
  }

  isOnRegister(): boolean {
    return this.rotaAtual ==='/register'
  }
}
