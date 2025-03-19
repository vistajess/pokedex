import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { PokemonSelectors } from 'src/app/core/data/pokemon';
import { PokemonDetail } from 'src/app/core/types';
import { getTypeIconSrc } from '../../helpers/image.helper';

@Component({
  selector: 'pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent implements OnInit {

  constructor(private store: Store) { }

  ///
  /// input
  ///

  @Input()
  get details() { return this._details; }
  set details(value: PokemonDetail | null) {
    if (value) {
      this._details = value;
    }
  }
  private _details: PokemonDetail | null = null;

  ngOnInit(): void {

  }

  getTypeIconSrc = getTypeIconSrc

  get pokemonTypes() {
    return this.details?.types.map((type) => type.type.name);
  }
}
