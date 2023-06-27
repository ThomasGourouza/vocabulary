import { Pipe, PipeTransform } from '@angular/core';
import { translate } from '../models/language';

@Pipe({
  name: 'translateLang',
})
export class TranslateLangPipe implements PipeTransform {

  transform(lang?: string): string {
    return translate(lang);
  }
}
