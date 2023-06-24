import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../models/item';

@Pipe({
  name: 'priority',
})
export class PriorityPipe implements PipeTransform {

  transform(items: Array<Item>, priority: number | undefined): Array<Item> {
    return items.filter((item) => item.priority === priority);
  }
}
