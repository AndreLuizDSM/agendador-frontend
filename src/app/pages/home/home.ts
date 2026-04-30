import { Component, inject, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from "@angular/router";
import { Auth } from '../../services/auth.services';
import { User } from '../../services/user.services';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  encapsulation: ViewEncapsulation.None
})
export class Home {
  imgHero = 'assets/imagem-hero.svg'

  private authService = inject(Auth);
  private userService = inject(User);
  private router = inject(Router);

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.authService.logout();
      console.log('Deslogado')
    }
  }
}
