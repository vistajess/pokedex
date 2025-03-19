import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxGroupModule } from 'src/app/shared/component/checkbox-group/checkbox-group.module';
import { DropdownModule } from 'src/app/shared/component/dropdown/dropdown.module';
import { SidebarFilterComponent } from './sidebar-filter.component';
import { SliderModule } from 'src/app/shared/component/slider/slider.module';
import { DynamicFormFieldDirective } from 'src/app/shared/component/dynamic-form/dynamic-form-field/dynamic-form-field.directive';
import { DynamicFormComponent } from 'src/app/shared/component/dynamic-form/dynamic-form.component';
import { DynamicFormFieldsModule } from 'src/app/shared/component/dynamic-form/dynamic-form-fields.module';

@NgModule({
  declarations: [
    SidebarFilterComponent,
    DynamicFormFieldDirective,
    DynamicFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // DropdownModule,
    // CheckboxGroupModule,
    // SliderModule,
    DynamicFormFieldsModule
  ],
  exports: [SidebarFilterComponent]
})
export class SidebarFilterModule { } 