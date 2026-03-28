import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-tasks',
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
  encapsulation: ViewEncapsulation.None
})
export class Tasks { 
  
}
