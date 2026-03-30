import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopMenu } from "./shared/components/global/top-menu/top-menu";
import { Footer } from './shared/components/global/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopMenu, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('agendador-de-tarefas');
}
