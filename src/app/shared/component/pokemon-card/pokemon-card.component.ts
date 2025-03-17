import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject, finalize, map, Observable, Subject, takeUntil } from 'rxjs';
import { PokemonSelectors, PokemonService } from 'src/app/core/data/pokemon';
import { Pokemon, PokemonDetail } from 'src/app/core/types';

@Component({
  selector: 'pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent implements OnInit {

  // pokemon: Pokemon | null = null;

  // @Select(PokemonState.getSelectedPokemon) pokemonDetails$!: Observable<Pokemon | null>;
  // private subscription: Subscription = new Subscription();
  // pokemonDetails$!: Observable<Pokemon | null>;

  pokemonDetails$!: Observable<Pokemon | null>;

  _isLoading$?: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  isLoading$ = this._isLoading$?.asObservable();

  _destroy$ = new Subject<void>();

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

  constructor(private store: Store, private pokemonService: PokemonService) { }

  ngOnInit(): void {
    // this.setLoading(true);
    // this.pokemonDetails$ = this.pokemonService.getPokemonDetails(this.identifier).pipe(
    //   takeUntil(this._destroy$),
    //   map((pokemon) => {
    //     console.log('pokemon', pokemon);
    //     this.pokemon = pokemon;
    //     return pokemon;
    //   }),
    //   finalize(() => this.setLoading(false))
    // );
  }

  private setLoading(loading: boolean): void {
    this._isLoading$?.next(loading);
  }
}
