import { ChangeDetectorRef, Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormFieldComponent } from '../base-form-field/base-form-field.component';
// Interface representing a checkbox option with a label and value
export interface CheckboxOption {
  label: string; // The display label for the checkbox
  value: any; // The value associated with the checkbox
}

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxGroupComponent),
      multi: true
    }
  ]
})
export class CheckboxGroupComponent extends BaseFormFieldComponent {

  constructor(
    private cd: ChangeDetectorRef
  ) {
    super();
  }


  @Input() options: { label: string; value: string }[] = [];

  override writeValue(value: any): void {
    this.value = Array.isArray(value) ? value : [];
    this.cd.markForCheck();
  }

  /**
   * Handles the change event of a checkbox
   * @param event - The event object
   * @param checkboxValue - The value of the checkbox
   */
  onCheckboxChange(event: Event, checkboxValue: string): void {
    const checked = (event.target as HTMLInputElement).checked; // Determine if the checkbox is checked

    if (checked) {
      this.value = [...this.value, checkboxValue]; // Add value if checked
    } else {
      this.value = this.value.filter((v: string) => v !== checkboxValue); // Remove value if unchecked
    }

    this.onChange(this.value); // Notify the form of the change
    this.onTouched(); // Mark the control as touched
  }
}