import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent {

  @Input() title: string = ''; // Title of the drawer

  @Input() isOpen: boolean = false; // Whether the drawer is open

  @Output() drawerClosed = new EventEmitter<void>(); // Emits when the drawer is closed

  /**
   * Closes the drawer
   */
  closeDrawer() {
    this.isOpen = false;
    this.drawerClosed.emit();
  }
}
