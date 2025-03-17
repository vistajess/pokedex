import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedMaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    SharedMaterialModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    SharedMaterialModule
  ]
})
export class SharedModule { }
