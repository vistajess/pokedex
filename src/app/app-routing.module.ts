import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth-guard.service';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pokemon',
  },
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'pokemon/:id',
    loadChildren: () => import('./pages/detail/detail.module').then(m => m.DetailModule)
  },
  {
    path: '**',
    redirectTo: 'pokemon'
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
