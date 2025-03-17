import { NgModule } from "@angular/core";
import { TypeIconPipe } from "./type-icon.pipe";

const pipes = [
  TypeIconPipe 
]

@NgModule({
  declarations: [...pipes],
  exports: [...pipes]
})
export class PipesModule { }