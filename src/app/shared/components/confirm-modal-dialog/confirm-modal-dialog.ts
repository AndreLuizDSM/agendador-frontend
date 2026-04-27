import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { ModalDialog } from '../modal-dialog/modal-dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';

interface dialogData {
  title: string,
  message: string,
  confirmButton: string,
  cancelButton: string
}

@Component({
  selector: 'app-confirm-modal-dialog',
  imports: [MatButtonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatTimepickerModule],
  templateUrl: './confirm-modal-dialog.html',
  styleUrl: './confirm-modal-dialog.scss',
})
export class ConfirmModalDialog {


  readonly dialogRef = inject(MatDialogRef<ModalDialog>);
  readonly data = inject<dialogData>(MAT_DIALOG_DATA);


  onSave() {
    this.dialogRef.close(this.data);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
