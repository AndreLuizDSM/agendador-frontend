import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouterState {
  private atualRotaSubject$ = new BehaviorSubject<string>('');
  public readonly atualRota$ = this.atualRotaSubject$.asObservable();

  constructor (private routes: Router){ // Injeção de dependencia
    this.atualRotaSubject$.next(routes.url); // Url inicial

    this.routes.events.pipe
    (filter(event => event instanceof NavigationEnd))
    .subscribe((evento: NavigationEnd) => 
    {this.atualRotaSubject$.next(evento.url)   
    })
  }

}
