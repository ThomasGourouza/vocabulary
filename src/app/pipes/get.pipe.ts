import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../models/item';

@Pipe({
  name: 'get',
})
export class GetPipe implements PipeTransform {

  transform(file: { [tab: string]: Item[]; } | null, key: 'priorities' | 'tabs', tab?: string): (number | string)[] {
    if (!file || (key === 'priorities' && !tab)) {
      return [];
    }
    if (key === 'priorities') {
      return [...new Set(file[tab as string].map((item) => item.priority))].sort((a, b) => a - b);
    }
    return Object.keys(file);
  }
}
