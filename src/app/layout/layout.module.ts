import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderModule } from './header/header.module';
import { SidebarModule } from './sidebar/sidebar.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SidebarModule,
    HeaderModule
  ],
  exports: [
    HeaderModule,
    SidebarModule
  ]
})
export class LayoutModule { } 