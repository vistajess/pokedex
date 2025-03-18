import { Component, Input, forwardRef, OnInit, HostListener, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface DropdownOption {
  value: any;
  label: string;
  disabled?: boolean;
  hasArrow?: boolean;
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]
})
export class DropdownComponent implements ControlValueAccessor, OnInit {
  @Input() options: DropdownOption[] = [];
  @Input() placeholder: string = 'Open list';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() id: string = `dropdown-${Math.random().toString(36).substring(2, 9)}`;
  @Input() activeColor: string = '#00c853'; // Green dot color

  value: any = null;
  isDisabled: boolean = false;
  touched: boolean = false;
  isOpen: boolean = false;
  selectedLabel: string = '';

  // ControlValueAccessor methods
  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  ngOnInit(): void {
    // Set initial selected label if value exists
    this.updateSelectedLabel();
  }

  writeValue(value: any): void {
    this.value = value;
    this.updateSelectedLabel();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // Custom methods
  toggleDropdown(): void {
    if (!this.isDisabled && !this.disabled) {
      this.isOpen = !this.isOpen;
      if (!this.touched) {
        this.markAsTouched();
      }
    }
  }

  selectOption(option: DropdownOption): void {
    if (!option.disabled) {
      this.value = option.value;
      this.selectedLabel = option.label;
      this.onChange(this.value);
      this.markAsTouched();
      
      // Don't close dropdown if option has arrow (indicating a submenu or action)
      if (!option.hasArrow) {
        this.isOpen = false;
      }
    }
  }

  markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  updateSelectedLabel(): void {
    const selectedOption = this.options.find(option => option.value === this.value);
    this.selectedLabel = selectedOption ? selectedOption.label : this.placeholder;
  }

  isSelected(option: DropdownOption): boolean {
    return this.value === option.value;
  }
}