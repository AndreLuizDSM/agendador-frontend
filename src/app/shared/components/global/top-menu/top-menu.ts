import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-top-menu',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './top-menu.html',
  styleUrl: './top-menu.scss',
})
export class TopMenu {
  logoApp = 'assets/Logo-Mny.png';
}
