import { MatDialogRef } from '@angular/material/dialog';

export interface DialogFields {
  name: string,
  label: string,
  value?: string | number | Date
  type?: string,
  button?: { icon: string, callback: (value: string, dialogRef: MatDialogRef<any>) => void }
  validators?: any[]
}

export interface dialogData {
  title: string,
  formConfig: DialogFields[] //Tipar DialogFields como array para ter as funcionalidades
}

export interface dialogDataConfirm {
  title: string,
  message: string,
  confirmButton: string,
  cancelButton: string
}
