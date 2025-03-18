import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PokemonFilters } from 'src/app/core/data/pokemon/types/pokemon-filters';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  searchControl = new FormControl('');

  @Output() onSearchChanged = new EventEmitter<PokemonFilters>();

  constructor() { }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.onSearchChanged.emit({ search: value });
      });
  }

}
