import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-table-default',
  templateUrl: './table-default.component.html'
})
export class TableDefaultComponent implements OnInit {
  @Input() public data!: Array<Item>;
  @Input() public firstNext!: boolean;
  @Input() public currentItem: Item | undefined;
  @Output() public onAction = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {
  }

  previous(): void {
    this.onAction.next("previous");
  }

  next(): void {
    this.onAction.next("next");
  }

}
