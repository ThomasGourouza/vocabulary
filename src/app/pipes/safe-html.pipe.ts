import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { JapaneseWord } from '../services/kuroshiro.service';

@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string, japaneseWords: JapaneseWord[] | null): SafeHtml {
    const japaneseWord = japaneseWords?.find(word => word.japanese === text);
    if (japaneseWord === undefined) {
      return this.sanitizer.bypassSecurityTrustHtml(text);
    }
    return this.sanitizer.bypassSecurityTrustHtml(japaneseWord.furigana);
  }
}
