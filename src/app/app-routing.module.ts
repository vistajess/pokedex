import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pokemon',
  },
  {
    path: '',
    loadChildren: () => import('./views/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'pokemon/:id',
    loadChildren: () => import('./views/detail/detail.module').then(m => m.DetailModule)
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
