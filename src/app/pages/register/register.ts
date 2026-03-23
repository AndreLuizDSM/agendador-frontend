import { Component, ViewEncapsulation } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { PasswordField } from "../../shared/components/password-field/password-field";

@Component({
  selector: 'app-register',
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, PasswordField],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  encapsulation: ViewEncapsulation.None
})
export class Register {}
