import { Component, inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

export interface DialogFields {
  name: string
  label: string,
  validators?: any[]
}

interface dialogData {
  title: string,
  formConfig: DialogFields[] //Tipar DialogFields como array para ter as funcionalidades
}

@Component({
  selector: 'app-modal-dialog',
  imports: [MatButtonModule, FormsModule, MatInputModule, MatFormFieldModule, MatDialogContent, MatDialogActions, ReactiveFormsModule],
  templateUrl: './modal-dialog.html',
  styleUrl: './modal-dialog.scss',
  encapsulation: ViewEncapsulation.None
})
export class ModalDialog {

  readonly formBuilder = inject(FormBuilder)
  readonly dialogRef = inject(MatDialogRef<ModalDialog>);
  readonly data = inject<dialogData>(MAT_DIALOG_DATA);

  fields:DialogFields[] = this.data.formConfig

  private buildControls(): Record<string, any> {
    const controls: Record<string, any> = {}

    this.fields.forEach(field => (
      controls[field.name] = ['', field.validators || []]
    ))

    return controls
  }
  
  form: FormGroup = this.formBuilder.group(this.buildControls())

  onSave() {
    this.dialogRef.close(this.form.value);
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
}
