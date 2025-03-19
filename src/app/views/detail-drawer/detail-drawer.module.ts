import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DetailDrawerComponent } from './detail-drawer.component';

@NgModule({
  declarations: [
    DetailDrawerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PipesModule
  ],
  exports: [DetailDrawerComponent]
})
export class DetailDrawerModule { } 