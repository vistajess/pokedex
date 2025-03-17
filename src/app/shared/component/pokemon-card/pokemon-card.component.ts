import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { PokemonSelectors } from 'src/app/core/data/pokemon';
import { PokemonDetail } from 'src/app/core/types';
import { getTypeIconSrc } from '../../helpers/image';

@Component({
  selector: 'pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent implements OnInit {


  ///
  /// input
  ///
  @Input()
  get identifier() { return this._identifier; }
  set identifier(value: string) {
    this._identifier = value;
  }
  private _identifier: string = '';

  @Input()
  get pokemon() { return this._pokemon; }
  set pokemon(value: PokemonDetail | null) {
    if (value) {
      const pokemonDetail = this.store.selectSnapshot(PokemonSelectors.getPokemonDetailByName)(value?.name);
      this._pokemon = pokemonDetail;
    }
  }
  private _pokemon: PokemonDetail | null = null;

  constructor(private store: Store) { }

  ngOnInit(): void {

  }

  getTypeIconSrc = getTypeIconSrc

  get pokemonTypes() {
    return this.pokemon?.types.map((type) => type.type.name);
  }
}
