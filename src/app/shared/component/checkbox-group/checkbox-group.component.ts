import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface CheckboxOption {
  label: string;
  value: any;
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
export class CheckboxGroupComponent implements ControlValueAccessor {
  
  @Input() label: string = '';

  @Input() options: { label: string; value: string }[] = [];

  value: string[] = [];
  onChange: (value: string[]) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string[]): void {
    this.value = value || [];
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onCheckboxChange(event: Event, checkboxValue: string): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.value = [...this.value, checkboxValue];
    } else {
      this.value = this.value.filter((v) => v !== checkboxValue);
    }

    this.onChange(this.value);
    this.onTouched();
  }
}