import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

export interface JapaneseWord {
  japanese: string;
  furigana: string;
}

@Injectable()
export class KuroshiroService {

  private _japaneseWords$ = new BehaviorSubject<JapaneseWord[]>([]);
  private kuroshiro = new Kuroshiro();
  private kuroshiroInitDict: Promise<void>;

  constructor() {
    this.kuroshiroInitDict = this.kuroshiro.init(new KuromojiAnalyzer({ dictPath: 'assets/dict' }));
  }

  get japaneseWords$(): Observable<JapaneseWord[]> {
    return this._japaneseWords$.asObservable();
  }

  public addJapaneseWord(japanese: string): void {
    this.kuroshiroInitDict.then(() =>
      this.kuroshiro.convert(japanese, { to: 'hiragana', mode: 'furigana' })
    ).then((furigana) =>
      this._japaneseWords$.next([...this._japaneseWords$.getValue(), { japanese, furigana }])
    );
  }
}
