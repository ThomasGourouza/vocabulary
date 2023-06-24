import { Component, Input } from '@angular/core';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent {

  @Input() data: Item[] = [];
  @Input() priority: number | undefined;
  public showList = false;

  public toggleList() {
    this.showList = !this.showList && this.data.length > 0 && !!this.priority;
  }
}

