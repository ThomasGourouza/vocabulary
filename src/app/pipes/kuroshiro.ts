import { Pipe, PipeTransform } from '@angular/core';
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'kuroshiro',
})
export class KuroshiroPipe implements PipeTransform {

  private kuroshiro = new Kuroshiro();
  private kuroshiroInitDict: Promise<void>;

  constructor(private sanitizer: DomSanitizer) {
    this.kuroshiroInitDict = this.kuroshiro.init(new KuromojiAnalyzer({ dictPath: 'assets/dict' }));
  }

  transform(text: string, language: string): Promise<SafeHtml> {
    if (language.toLocaleLowerCase() !== 'japanese') {
      return new Promise<string>(resolve => resolve(text));
    }
    return this.kuroshiroInitDict.then(() => {
      return this.kuroshiro.convert(text, { to: 'hiragana', mode: 'furigana' });
    }).then((htmlCode) =>
      this.sanitizer.bypassSecurityTrustHtml(htmlCode)
    );
  }
}
