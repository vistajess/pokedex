import { NgModule } from "@angular/core";
import { HeaderComponent } from "./header.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  imports: [ReactiveFormsModule]
})
export class HeaderModule { }
