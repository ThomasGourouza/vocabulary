import { Component, Input } from '@angular/core';
import { Grammar } from 'src/app/models/grammar';

@Component({
  selector: 'app-table-verb',
  templateUrl: './table-verb.component.html'
})
export class TableVerbComponent {

  @Input() public data!: Array<Grammar>;
  @Input() public currentItem: Grammar | undefined;
  @Input() public firstNext!: boolean;

}
