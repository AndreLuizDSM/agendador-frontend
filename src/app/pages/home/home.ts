import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from "@angular/router";
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  encapsulation: ViewEncapsulation.None
})
export class Home {
  imgHero = 'assets/imagem-hero.svg'

  private AuthService = inject(Auth);
  private router = inject(Router);

  // ngOnInit(): void{
  //   if(this.AuthService.isLoggedIn()){
  //     this.router.navigate(['/tasks'])
  //   }
  // }
}
