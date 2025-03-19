import { Component, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicFieldConfig } from './dynamic-form-field/dynamic-form-field.directive';

@Component({
  selector: 'app-dynamic-form',
  template: `
    <form class="dynamic-form" [formGroup]="dynamicFormGroup">
      <ng-container *ngFor="let fieldConfig of fieldConfigs">
        <div class="form-field-container">
          <ng-container *ngIf="getFormControl(fieldConfig.name) as control; else missingControl" 
                       appDynamicFormField 
                       [config]="fieldConfig" 
                       [control]="control">
          </ng-container>

          <ng-template #missingControl>
            <div class="error-message">Control "{{ fieldConfig.name }}" is missing.</div>
          </ng-template>
        </div>
      </ng-container>
    </form>
  `,
  styles: [`
    .dynamic-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 16px;
    }
      
    .form-field-container {
      min-height: 40px;
    }
  `]
})
export class DynamicFormComponent implements OnDestroy {

  // Input property to receive field configurations for the dynamic form
  @Input() fieldConfigs: DynamicFieldConfig[] = [];

  // Input property to set the FormGroup for the dynamic form
  @Input() set dynamicFormGroup(group: FormGroup) {
    this._dynamicFormGroup = group;
  }
  private _dynamicFormGroup!: FormGroup;

  // Getter for the dynamic form group
  get dynamicFormGroup(): FormGroup {
    return this._dynamicFormGroup;
  }

  constructor() { }

  ngOnInit() {
    // Initialization logic if needed
  }

  // Method to get the FormControl by path
  getFormControl(path: string): FormControl | null {
    if (!this.dynamicFormGroup) return null; // Return null to avoid invalid FormControl

    const control = this.dynamicFormGroup.get(path);
    return control instanceof FormControl ? control : null; // Ensure the control is a FormControl
  }

  ngOnDestroy(): void {
    // Component cleanup if needed
  }
}