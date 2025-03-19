import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// Import form field components
import { CheckboxGroupComponent } from '../component/checkbox-group/checkbox-group.component';
import { CheckboxGroupModule } from '../component/checkbox-group/checkbox-group.module';
import { DropdownComponent } from '../component/dropdown/dropdown.component';
import { DropdownModule } from '../component/dropdown/dropdown.module';
import { SliderNumberComponent } from '../component/slider/slider.component';
import { SliderModule } from '../component/slider/slider.module';
import { ComponentType } from '../helpers/component.helper';
import { ComponentRegistryService } from '../services/component-registry.service';

@NgModule({
  declarations: [
    // Declare form field components
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    CheckboxGroupModule,
    SliderModule
  ],
  exports: [
    // Export form field components
    DropdownModule,
    CheckboxGroupModule,
    SliderModule
  ]
})
export class DynamicFormFieldsModule {
  constructor(private registry: ComponentRegistryService) {
    this.registerComponents();
  }

  static forRoot(): ModuleWithProviders<DynamicFormFieldsModule> {
    return {
      ngModule: DynamicFormFieldsModule,
      providers: [
        ComponentRegistryService
      ]
    };
  }

  /**
   * Registers all components with the registry service
   * Call this method in your app initialization
   */
  registerComponents(): void {
    // Register form field components with their type identifiers
    this.registry.register(ComponentType.DROPDOWN, DropdownComponent);
    this.registry.register(ComponentType.CHECKBOX, CheckboxGroupComponent);
    this.registry.register(ComponentType.SLIDER, SliderNumberComponent);
    // Register more components as needed
  }
}