import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UtilityComponent } from './utility.component';

const routes: Routes = [{ path: '', component: UtilityComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilityRoutingModule { }
