import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../models/item';

@Pipe({
  name: 'get',
})
export class GetPipe implements PipeTransform {

  transform(file: { [tab: string]: Item[]; } | null, key: 'tags' | 'tabs', tab?: string): string[] {
    if (!file || (key === 'tags' && tab === undefined)) {
      return [];
    }
    if (key === 'tags') {
      return [...new Set(file[tab as string].map((item) => item.tag))].sort(this.customSort);
    }
    return Object.keys(file);
  }

  private customSort(a: number | string, b: number | string): number {
    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    } else if (typeof a === 'string' && typeof b === 'string') {
      return a.localeCompare(b);
    } else if (typeof a === 'number') {
      return -1;
    } else {
      return 1;
    }
  }
}
