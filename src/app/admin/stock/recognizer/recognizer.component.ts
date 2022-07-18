import {
  animate,
  animateChild,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
export const EnterExitRight = [
  trigger('enterExitRight', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateX(200px)' }),
      animate(
        '300ms ease-in',
        style({ opacity: 1, transform: 'translateX(0)' })
      ),
    ]),
    transition(':leave', [
      animate(
        '300ms ease-in',
        style({ opacity: 0, transform: 'translateX(200px)' })
      ),
    ]),
  ]),
];
@Component({
  selector: 'app-recognizer',
  templateUrl: './recognizer.component.html',
  styleUrls: ['./recognizer.component.scss'],
  animations: [
    EnterExitRight
  ],
})
export class RecognizerComponent implements OnInit {
  @Input() recognizedText: string = '';
  @Output() stopRecognition = new EventEmitter<any>();
  constructor() {}

  ngOnInit(): void {}
}
