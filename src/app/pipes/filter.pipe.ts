import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../models/item';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {

  transform(file: { [tab: string]: Item[]; } | null, tab: string | undefined, priority: number | undefined): Item[] {
    if (!file || tab === undefined || priority === undefined) {
      return [];
    }
    return file[tab].filter((item) => item.priority === priority);
  }
}
