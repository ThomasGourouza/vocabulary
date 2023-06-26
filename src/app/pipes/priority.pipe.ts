import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../models/item';

@Pipe({
  name: 'priority',
})
export class PriorityPipe implements PipeTransform {

  transform(items: Item[], priority: number | undefined): Item[] {
    return items.filter((item) => item.priority === priority);
  }
}
