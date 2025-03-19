import { Component, ElementRef, forwardRef, HostListener, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormFieldComponent } from '../base-form-field/base-form-field.component';

export interface DropdownOption {
  value: any; // The value associated with the dropdown option
  label: string; // The display label for the dropdown option
  disabled?: boolean; // Optional flag to disable the option
  hasArrow?: boolean; // Optional flag to indicate if the option has a submenu
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
export class DropdownComponent extends BaseFormFieldComponent implements ControlValueAccessor, OnInit {

  @Input() options: DropdownOption[] = []; // List of dropdown options

  @Input() placeholder: string = 'Select an option'; // Placeholder text when no option is selected

  @Input() required: boolean = false; // Indicates if the dropdown is required

  @Input() disabled: boolean = false; // Indicates if the dropdown is disabled

  @Input() id: string = `dropdown-${Math.random().toString(36).substring(2, 9)}`; // Unique ID for the dropdown

  @Input() activeColor: string = '#00c853'; // Color for active state

  isDisabled: boolean = false; // Internal state for disabled status

  touched: boolean = false; // Tracks if the dropdown has been interacted with

  isOpen: boolean = false; // Tracks if the dropdown is currently open
  
  selectedLabel: string = ''; // Label of the currently selected option

  constructor(private elementRef: ElementRef) { 
    super();
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    // Close dropdown if clicked outside
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  ngOnInit(): void {
    // Set initial selected label if value exists
    this.updateSelectedLabel();
  }

  ///
  /// ControlValueAccessor methods
  ///

  override writeValue(value: any): void {
    this.value = value; // Set the value from the form control
    this.updateSelectedLabel(); // Update the displayed label
  }
  

  ///
  /// methods
  ///

  /**
   * Set the disabled state of the dropdown.
   * @param isDisabled - Boolean indicating whether the dropdown should be disabled.
   */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled; 
  }

  // Custom methods

  /**
   * Toggle the open/close state of the dropdown.
   */
  toggleDropdown(): void {
    if (!this.isDisabled && !this.disabled) {
      this.isOpen = !this.isOpen;
      if (!this.touched) {
        this.markAsTouched(); // Mark as touched if not already
      }
    }
  }

  /**
   * Select an option from the dropdown.
   * @param option - The DropdownOption to select.
   */
  selectOption(option: DropdownOption): void {
    if (!option.disabled) {
      this.value = option.value; // Set the selected value
      this.selectedLabel = option.label; // Update the displayed label
      this.onChange(this.value); // Notify the form control of the change
      this.markAsTouched(); // Mark as touched
      
      // Don't close dropdown if option has arrow (indicating a submenu or action)
      if (!option.hasArrow) {
        this.isOpen = false; // Close dropdown if no submenu
      }
    }
  }

  /**
   * Mark the dropdown as touched.
   */
  markAsTouched(): void {
    if (!this.touched) {
      this.onTouched(); // Notify the form control
      this.touched = true; // Update touched state
    }
  }

  /**
   * Update the displayed label based on the selected value.
   */
  updateSelectedLabel(): void {
    const selectedOption = this.options.find(option => option.value === this.value);
    this.selectedLabel = selectedOption ? selectedOption.label : this.placeholder; // Set label or placeholder
  }

  /**
   * Check if the given option is selected.
   * @param option - The DropdownOption to check.
   * @returns {boolean} - True if the option is selected, false otherwise.
   */
  isSelected(option: DropdownOption): boolean {
    return this.value === option.value;
  }
}