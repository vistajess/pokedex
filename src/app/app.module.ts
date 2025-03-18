import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PokemonState } from './core/data/pokemon/store/pokemon-state';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { createDefaultQueryClient, createOtherQueryClient, createPokemonQueryClient } from './core/query/query-client.factory';
import { DEFAULT_QUERY_CLIENT, OTHER_QUERY_CLIENT, POKEMON_QUERY_CLIENT } from './core/query/query-client.token';
import { MatSnackBarModule } from '@angular/material/snack-bar';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    // Angular modules
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // Ngxs modules
    NgxsModule.forRoot([PokemonState], {
      developmentMode: !environment.production
    }),

    // Material modules
    MatSnackBarModule, // Used for displaying snackbar notifications basically for authentication errors

    // App routing module
    AppRoutingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: DEFAULT_QUERY_CLIENT, useFactory: createDefaultQueryClient },
    { provide: POKEMON_QUERY_CLIENT, useFactory: createPokemonQueryClient },
    { provide: OTHER_QUERY_CLIENT, useFactory: createOtherQueryClient }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
