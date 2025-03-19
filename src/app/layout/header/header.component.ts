import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PokemonFilters } from 'src/app/core/data/pokemon/types/pokemon-filters';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { OpenAIService } from 'src/app/core/services/openai.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  searchControl = new FormControl('');

  @Output() onSearchChanged = new EventEmitter<PokemonFilters>();

  constructor(private openaiService: OpenAIService) { }

  ngOnInit(): void {
    // this.searchControl.valueChanges
    //   .pipe(
    //     debounceTime(500),
    //     distinctUntilChanged()
    //   )
    //   .subscribe((value) => {
    //     this.onSearchChanged.emit({ search: value });
    //   });
  }

  interpretDescription() {
    this.openaiService.interpretDescription(this.searchControl.value).then((result) => {
      console.log(result);
    });
  }

}
