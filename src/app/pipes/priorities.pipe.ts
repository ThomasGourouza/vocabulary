import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../models/item';

@Pipe({
  name: 'priorities',
})
export class PrioritiesPipe implements PipeTransform {

  transform(items: Item[]): number[] {
    return [...new Set(items.map((item) => item.priority))];
  }
}
