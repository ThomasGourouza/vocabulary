import { Component, Input } from '@angular/core';
import { Grammar } from 'src/app/models/grammar';

@Component({
  selector: 'app-table-default',
  templateUrl: './table-default.component.html'
})
export class TableDefaultComponent {

  @Input() public data!: Array<Grammar>;
  @Input() public currentItem: Grammar | undefined;
  @Input() public firstNext!: boolean;

}
