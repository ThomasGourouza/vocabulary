import { Component, Input } from '@angular/core';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html'
})
export class TableListComponent {
  @Input() items!: Item[];
  public showList = false;

  public toggleList() {
    this.showList = !this.showList && this.items.length > 0;
  }
}
