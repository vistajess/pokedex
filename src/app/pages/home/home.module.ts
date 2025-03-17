import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LayoutModule } from 'src/app/layout/layout.module';
import { PokemonCardModule } from 'src/app/shared/component/pokemon-card/pokemon-card.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    LayoutModule,
    ScrollingModule,
    PokemonCardModule
  ]
})
export class HomeModule { } 