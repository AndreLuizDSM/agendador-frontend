import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogData, DialogFields, ModalDialog } from '../modal-dialog/modal-dialog';

@Component({
  selector: 'app-confirm-modal-dialog',
  imports: [],
  templateUrl: './confirm-modal-dialog.html',
  styleUrl: './confirm-modal-dialog.scss',
})
export class ConfirmModalDialog {

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
