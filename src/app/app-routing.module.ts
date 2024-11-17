import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./customer/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
      // canActivate:[AdminGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./customer/login/login.module').then((m) => m.LoginModule),
  },
  { path: 'signup', loadChildren: () => import('./customer/signup/signup.module').then(m => m.SignupModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
