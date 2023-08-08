import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flagUrl',
})
export class FlagUrlPipe implements PipeTransform {

  transform(lang: string): string {
    return `assets/flags/${lang}.png`;
  }
}
