import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  toastAudio = new Audio();
  toastErrorAudio = new Audio();

  constructor(private snackbar: MatSnackBar) {
    this.toastAudio.src = '/assets/audio/toast.wav';
    this.toastAudio.volume = 0.4;
    this.toastAudio.load();
    this.toastErrorAudio.src = '/assets/audio/error.mp3';
    this.toastErrorAudio.volume = 0.4;
    this.toastErrorAudio.load();
  }

  presentToast(
    message: string,
    type: 'info' | 'error' = 'info',
    duration: number = 5000,
    action: string = '',
    sound: boolean = true
  ) {
    this.snackbar.open(message, action, { duration: duration });
    if (sound && type === 'info') {
      this.toastAudio.play();
    } else if (sound && type === 'error') {
      this.toastErrorAudio.play();
    }
  }
}
