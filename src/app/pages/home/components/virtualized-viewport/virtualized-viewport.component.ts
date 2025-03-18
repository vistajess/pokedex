import { Component, Input } from "@angular/core";

@Component({
  selector: 'virtualized-viewport',
  templateUrl: './virtualized-viewport.component.html',
  styleUrls: ['./virtualized-viewport.component.css']
})
export class VirtualizedViewportComponent {
  @Input() items: any[] = [];
  @Input() itemSize: number = 280;
}
