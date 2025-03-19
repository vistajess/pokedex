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

  @Input() checked: boolean = false;

  @Input() disabled: boolean = false;

  @Output() checkboxChange = new EventEmitter<{ value: any, checked: boolean }>();

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleCheckbox(): void {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.onChange(this.checked);
      this.onTouched();
    }
  }
}