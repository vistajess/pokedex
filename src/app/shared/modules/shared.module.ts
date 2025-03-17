import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { SharedMaterialModule } from './material.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    SharedMaterialModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    SharedMaterialModule
  ]
})
export class SharedModule { }
