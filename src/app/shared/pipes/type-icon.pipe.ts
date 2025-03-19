import { Pipe, PipeTransform } from '@angular/core';
import { getTypeIconSrc } from '../helpers/image.helper';
import { PokemonType } from 'src/app/core/types';

@Pipe({
  name: 'typeIcon'
})
export class TypeIconPipe implements PipeTransform {
  transform(type: PokemonType): string {
    return getTypeIconSrc(type.type.name);
  }
}
