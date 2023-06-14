import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './user/services/auth.guard';

const routes: Routes = [{path:'', 
loadChildren:() => import('./conference/conference.module').then(m => m.ConferenceModule),
  canActivate: [authGuard]},
{path:'login', loadChildren: () => import('./user/user.module').then(m => m.UserModule)}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
