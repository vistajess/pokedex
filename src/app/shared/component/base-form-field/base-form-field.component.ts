import { Component, forwardRef, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BaseFormFieldComponent),
      multi: true
    }
  ]
})
export class BaseFormFieldComponent implements ControlValueAccessor {
  // Input property for the label of the form field
  @Input() label: string = '';
  
  // Input property for the FormControl associated with this field
  @Input() formControl!: FormControl;
  
  // Internal value for the form field
  value: any;

  // Callback function for when the value changes
  onChange = (_: any) => {};
  
  // Callback function for when the field is touched
  onTouched = () => {};

  // Writes a new value to the element
  writeValue(value: any): void {
    this.value = value; // Set the internal value
  }

  // Registers a callback function that should be called when the control's value changes
  registerOnChange(fn: any): void {
    this.onChange = fn; // Assign the provided function to the onChange callback
  }

  // Registers a callback function that should be called when the control is touched
  registerOnTouched(fn: any): void {
    this.onTouched = fn; // Assign the provided function to the onTouched callback
  }
} 