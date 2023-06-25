import { Component, Input } from '@angular/core';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-table-default',
  templateUrl: './table-default.component.html'
})
export class TableDefaultComponent {
  @Input() public data!: Array<Item>;
  @Input() public firstNext!: boolean;
  @Input() public currentItem: Item | undefined;
}
