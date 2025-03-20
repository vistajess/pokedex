import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { LayoutModule } from 'src/app/layout/layout.module';
import { PokemonCardModule } from 'src/app/shared/component/pokemon-card/pokemon-card.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { DetailDrawerModule } from './components/detail-drawer/detail-drawer.module';

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
    PokemonCardModule,
    DetailDrawerModule,
    // Specify ng-circle-progress as an import
    // Demo link for reference: https://bootsoon.github.io/ng-circle-progress/
    NgCircleProgressModule.forRoot({
      "radius": 60,
      "space": -10,
      "outerStrokeGradient": true,
      "outerStrokeWidth": 10,
      "outerStrokeColor": "#4882c2",
      "outerStrokeGradientStopColor": "#53a9ff",
      "innerStrokeColor": "#e7e8ea",
      "innerStrokeWidth": 10,
      "title": "Loading batch data...",
      "titleColor": "700",
      "showSubtitle": true,
      "subtitle": "Please wait while we load the data.",
      "subtitleColor": "700",
      "subtitleFontSize": "12",
      "animateTitle": false,
      "animationDuration": 1000,
      "showUnits": false,
      "showBackground": false,
      "clockwise": false,
      "startFromZero": false,
      "lazy": true
    }),
  ]
})
export class HomeModule { } 