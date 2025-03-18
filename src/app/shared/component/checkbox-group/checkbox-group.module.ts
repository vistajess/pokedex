import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CheckboxGroupComponent } from '../checkbox-group/checkbox-group.component';

@NgModule({
  declarations: [
    CheckboxGroupComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CheckboxGroupComponent
  ]
})
export class CheckboxGroupModule { }