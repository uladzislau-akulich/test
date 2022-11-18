import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../components/notification/notification.component';

export enum NotificationModes {
  Success = 'success',
  Error = 'error'
}

@Injectable({
  providedIn: 'root',
})

export class NotificationService {
  constructor(private snackBar: MatSnackBar) { }

  showNotification(text: string, mode: NotificationModes): void {
    this.snackBar.openFromComponent(NotificationComponent, {
      data: text,
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      panelClass: [mode],
    });
  }
}
