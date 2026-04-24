import { Component, inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

export interface DialogFields {
  name: string,
  label: string,
  value?: string | number | Date
  type?: string,
  button?: { icon: string, callback: (value: string, dialogRef: MatDialogRef<ModalDialog>) => void }
  validators?: any[]
}

interface dialogData {
  title: string,
  formConfig: DialogFields[] //Tipar DialogFields como array para ter as funcionalidades
}

@Component({
  selector: 'app-modal-dialog',
  imports: [MatButtonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogActions,
    ReactiveFormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatTimepickerModule
  ],
  templateUrl: './modal-dialog.html',
  styleUrl: './modal-dialog.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()]
})
export class ModalDialog {

  readonly formBuilder = inject(FormBuilder)
  readonly dialogRef = inject(MatDialogRef<ModalDialog>);
  readonly data = inject<dialogData>(MAT_DIALOG_DATA);

  fields: DialogFields[] = this.data.formConfig

  private buildControls(): Record<string, any> {
    const controls: Record<string, any> = {}

    this.fields.forEach(field => (
      controls[field.name] = [field.value ?? '', field.validators || []]
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

  checkValidators(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched
      return true
    }
    return false
  }

  get fieldError(): string | null {
    const fieldControl = this.form.get('') //TODO Achar um parâmetro do modal para verificar se tem error e colocar o matError
    if (fieldControl?.hasError('required')) return 'Campo obrigatório*';
    return null
  }
}
