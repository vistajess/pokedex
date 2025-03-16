import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs/internal/Observable';
import { FetchPokemonList } from 'src/app/core/data/pokemon/store';
import { PokemonState } from 'src/app/core/data/pokemon/store/pokemon-state';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @Select(PokemonState.getPokemonList) pokemons$!: Observable<any[]>;
  @Select(PokemonState.isLoading) loading$!: Observable<boolean>;
  @Select(PokemonState.getError) error$!: Observable<string>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.store.dispatch(new FetchPokemonList());
  }

}
