import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { } from './layout/sidebar/sidebar.component';
import { environment } from 'src/environments/environment';
import { NgxsModule } from '@ngxs/store';
import { PokemonState } from './core/data/pokemon/store/pokemon-state';
import { PokemonService } from './core/data/pokemon/services';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxsModule.forRoot([PokemonState], {
      developmentMode: !environment.production
    })
  ],
  providers: [PokemonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
