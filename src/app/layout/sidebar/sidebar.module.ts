import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxGroupModule } from 'src/app/shared/component/checkbox-group/checkbox-group.module';
import { DropdownModule } from 'src/app/shared/component/dropdown/dropdown.module';
import { SidebarComponent } from './sidebar.component';
import { SliderModule } from 'src/app/shared/component/slider/slider.module';

@NgModule({
  declarations: [SidebarComponent],
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    DropdownModule,
    CheckboxGroupModule,
    SliderModule
  ],
  exports: [SidebarComponent]
})
export class SidebarModule { } 