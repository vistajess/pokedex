import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LayoutModule } from 'src/app/layout/layout.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PokemonCardComponent } from 'src/app/shared/component/pokemon-card/pokemon-card.component';

@NgModule({
  declarations: [
    HomeComponent,
    PokemonCardComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    LayoutModule,
    ScrollingModule
  ]
})
export class HomeModule { } 