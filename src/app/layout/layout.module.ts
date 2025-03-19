import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderModule } from './header/header.module';
import { SidebarFilterModule } from './sidebar-filter/sidebar-filter.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SidebarFilterModule,
    HeaderModule
  ],
  exports: [
    HeaderModule,
    SidebarFilterModule
  ]
})
export class LayoutModule { } 