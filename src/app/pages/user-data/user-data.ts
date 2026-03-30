import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User, UserResponse } from '../../services/user';
import { email } from '@angular/forms/signals';

@Component({
  selector: 'app-user-data',
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './user-data.html',
  styleUrl: './user-data.scss',
  encapsulation: ViewEncapsulation.None
})
export class UserData {

  form!: FormGroup
  user: UserResponse | null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: User
  ) {
    this.user = userService.getUser()
    this.form = formBuilder.group({
      nome: [{ value: this.user?.nome || '', disabled: true }],
      email: [{ value: this.user?.email || '', disabled: true }]
    })
  }
}
