import { ChangeDetectorRef, Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormFieldComponent } from '../base-form-field/base-form-field.component';

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

  onCheckboxChange(event: Event, checkboxValue: string): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.value = [...this.value, checkboxValue];
    } else {
      this.value = this.value.filter((v: string) => v !== checkboxValue);
    }

    this.onChange(this.value);
    this.onTouched();
  }
}