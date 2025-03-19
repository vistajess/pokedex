import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PokemonDetail } from 'src/app/core/types';
@Component({
  selector: 'pokemon-detail-drawer',
  templateUrl: './detail-drawer.component.html',
  styleUrls: ['./detail-drawer.component.scss']
})
export class DetailDrawerComponent implements OnInit {

  @Input() isDrawerOpen = false;

  @Output() drawerClosed = new EventEmitter<void>();

  @Input() selectedPokemon: PokemonDetail | null = null;

  constructor() { }

  ngOnInit(): void {
    // Use the 'id' parameter as needed
    console.log(this.selectedPokemon);
  }

  // Utility function to dynamically set CSS variables for animation
  getStatFillStyle(value: number): { [key: string]: string } {
    const percentage = (value / 255) * 100;
    return {
      'width': `${percentage}%`,
      'transition': 'width 1s ease-in-out'
    };
  }
  
  getStatClasses(index: number, baseStat: number): Record<string, boolean> {
    // console.log({
    //   [`delay-${index + 1}`]: baseStat > 0,
    //   'zero': baseStat === 0
    // });
    return {
      [`delay-${index + 1}`]: baseStat > 0,
      'zero': baseStat === 0
    };
  }

}
