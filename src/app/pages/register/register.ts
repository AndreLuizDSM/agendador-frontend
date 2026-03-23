import { Component, ViewEncapsulation } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { PasswordField } from "../../shared/components/password-field/password-field";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, PasswordField, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  encapsulation: ViewEncapsulation.None
})
export class Register {
  form: FormGroup;
  
  constructor(private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      fullName: [''],
      email: [''],
      password: ['']
    }) 
}

get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

submit(){
    console.log(this.form.value)
  }
}
