import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormFieldComponent } from '../base-form-field/base-form-field.component';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent extends BaseFormFieldComponent implements ControlValueAccessor {

  @Input() checked: boolean = false; // Whether the checkbox is checked

  @Input() disabled: boolean = false; // Whether the checkbox is disabled

  @Output() checkboxChange = new EventEmitter<{ value: any, checked: boolean }>(); // Emits the checkbox change event

  /**
   * Sets the disabled state of the checkbox
   * @param isDisabled - Whether the checkbox is disabled
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Toggles the checkbox state
   */
  toggleCheckbox(): void {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.onChange(this.checked);
      this.onTouched();
    }
  }
}