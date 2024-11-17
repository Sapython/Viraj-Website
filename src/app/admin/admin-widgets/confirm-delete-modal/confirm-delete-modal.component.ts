import { Component, OnInit, Output, EventEmitter } from '@angular/core';
declare const UIkit: any;

@Component({
  selector: 'app-confirm-delete-modal',
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.scss'],
})
export class ConfirmDeleteModalComponent implements OnInit {
  @Output() confirmDelete: EventEmitter<any> = new EventEmitter<any>();
  @Output() hidden: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  btnClick(confirm: boolean) {
    if (confirm) {
      this.confirmDelete.emit();
    }
    UIkit.modal(document.getElementById('confirm-delete-modal')).hide();
  }

  ngOnInit(): void {}
}
