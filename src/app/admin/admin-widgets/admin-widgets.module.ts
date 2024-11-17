import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnderConstructionComponent } from './under-construction/under-construction.component';
import { ConfirmDeleteModalComponent } from './confirm-delete-modal/confirm-delete-modal.component';

@NgModule({
  declarations: [UnderConstructionComponent, ConfirmDeleteModalComponent],
  imports: [CommonModule],
  exports: [UnderConstructionComponent, ConfirmDeleteModalComponent],
})
export class AdminWidgetsModule {}
