import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { SharedMaterialModule } from './material.module';
import { DrawerModule } from '../component/drawer/drawer.module';

const modules = [
  CommonModule,
  FormsModule,
  SharedMaterialModule,
  DrawerModule
]
@NgModule({
  declarations: [],
  imports: [
    ...modules
  ],
  exports: [
    ...modules
  ]
})
export class SharedModule { }
