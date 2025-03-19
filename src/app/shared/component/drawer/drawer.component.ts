import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent {
  @Input() title: string = '';
  @Input() isOpen: boolean = false;
  @Output() drawerClosed = new EventEmitter<void>();

  closeDrawer() {
    this.isOpen = false;
    this.drawerClosed.emit();
  }
}
