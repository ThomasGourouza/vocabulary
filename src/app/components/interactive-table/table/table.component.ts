import { Component, Input } from '@angular/core';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})
export class TableComponent {
  @Input() item: Item | undefined;
  @Input() showSecondWord!: boolean;
  @Input() isFrenchColFirst!: boolean;
}
