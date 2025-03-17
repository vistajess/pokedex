import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "../../modules/shared.module";
import { PipesModule } from "../../pipes/pipes.module";
import { PokemonCardComponent } from "./pokemon-card.component";

@NgModule({
  declarations: [PokemonCardComponent],
  imports: [CommonModule, SharedModule, PipesModule],
  exports: [PokemonCardComponent,]
})
export class PokemonCardModule {}