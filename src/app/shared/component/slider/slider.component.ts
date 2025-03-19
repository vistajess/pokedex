import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormFieldComponent } from '../base-form-field/base-form-field.component';
import { POKEMON_MAX_STAT } from 'src/app/core/data/pokemon/constants/pokemon.constants';

@Component({
  selector: 'app-slider-number',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderNumberComponent),
      multi: true
    }
  ]
})
export class SliderNumberComponent extends BaseFormFieldComponent implements ControlValueAccessor {

  @Input() min: number = 0;

  @Input() max: number = POKEMON_MAX_STAT;

  onSliderChange(event: any) {
    this.value = parseInt(event.target.value, 10); // Convert the value to an integer
    this.onChange(this.value);
    this.onTouched();
  }
}