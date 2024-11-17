import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertsAndNotificationsService } from './uiService/alerts-and-notifications.service';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root',
})
export class VoiceRecognitionService {
  recognition: any;
  isStoppedSpeechRecog = false;
  public text = '';
  tempWords: any;
  public words:Subject<string> = new Subject<string>();
  public readonly supported: boolean = false;
  constructor(private alertify: AlertsAndNotificationsService) {
    if (typeof webkitSpeechRecognition !== 'undefined') {
      this.recognition = new webkitSpeechRecognition();
      this.supported = true;
    }
  }

  init() {
    if (this.supported) {
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.addEventListener('result', (e: any) => {
        const transcript = Array.from(e.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        this.tempWords = transcript;
        console.log('TRE',transcript);
        this.words.next(transcript);
      });
    }  else {
      this.alertify.presentToast(
        'Speech recognition is not supported in your browser','error'
      );
    }
  }

  start() {
    if (this.supported) {
      this.isStoppedSpeechRecog = false;
      this.recognition.start();
      console.log('Speech recognition started');
      this.recognition.addEventListener('end', (condition: any) => {
        if (this.isStoppedSpeechRecog) {
          this.recognition.stop();
          console.log('End speech recognition');
        } else {
          this.wordConcat();
          this.recognition.start();
        }
      });
    }  else {
      this.alertify.presentToast(
        'Speech recognition is not supported in your browser','error'
      );
    }
  }
  stop() {
    this.isStoppedSpeechRecog = true;
    this.wordConcat();
    this.recognition.stop();
    console.log('End speech recognition');
  }

  wordConcat() {
    this.text = this.text + ' ' + this.tempWords + '.';
    this.tempWords = '';
  }
}
