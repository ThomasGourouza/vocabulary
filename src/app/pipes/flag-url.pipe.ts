import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flagUrl',
})
export class FlagUrlPipe implements PipeTransform {

  transform(lang: string): string {
    const extension = lang === 'spanish' ? 'svg' : 'png';
    return `assets/flags/${lang}.${extension}`;
  }
}
