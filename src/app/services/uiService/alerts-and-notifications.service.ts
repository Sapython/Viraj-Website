import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertsAndNotificationsService {
  testFunction() {
    console.log('testFunction');
  }
  toastAudio = new Audio();
  toastErrorAudio = new Audio();
  playAudio(type: 'toast' | 'errorToast') {
    if (type === 'toast') {
      this.toastAudio.play();
    } else if (type === 'errorToast') {
      this.toastErrorAudio.play();
    }
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
      this.playAudio('toast');
    } else if (sound && type === 'error') {
      this.playAudio('errorToast');
    }
  }

  constructor(private snackbar: MatSnackBar) {
    this.toastAudio.src = '/assets/audio/tones/toast.mp3';
    this.toastAudio.volume = 0.4;
    this.toastAudio.load();
    this.toastErrorAudio.src = '/assets/audio/tones/error.mp3';
    this.toastErrorAudio.volume = 0.4;
    this.toastErrorAudio.load();
  }
}
