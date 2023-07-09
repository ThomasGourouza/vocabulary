import { Pipe, PipeTransform } from '@angular/core';
import { toRomaji } from 'wanakana';

@Pipe({
  name: 'romaji',
})
export class RomajiPipe implements PipeTransform {

  transform(japaneseText: string): string {
    return japaneseText + " (" + toRomaji(japaneseText) + ")";
  }
}
