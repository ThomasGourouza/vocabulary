import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Item } from '../models/item';

@Injectable()
export class ReaderSpeakerService {

  private readonly baseUrl: string;
  private _isReadSpeakerActivated$ = new BehaviorSubject<boolean>(false);
  private _isPlaying$ = new BehaviorSubject<boolean>(false);
  private _isSecondWordDisplayed$ = new BehaviorSubject<boolean>(true);
  private _isFrenchColFirst$ = new BehaviorSubject<boolean>(true);

  constructor(
    private readonly http: HttpClient
  ) {
    this.baseUrl = 'https://ttsmp3.com/makemp3_new.php';
  }

  get isFrenchColFirst$(): Observable<boolean> {
    return this._isFrenchColFirst$.asObservable();
  }

  toggleIsFrenchColFirst$() {
    if (this._isPlaying$.getValue() || !this._isSecondWordDisplayed$.getValue()) {
      return;
    }
    this._isFrenchColFirst$.next(!this._isFrenchColFirst$.getValue());
  }

  textToSpeach(position: number, item: Item): void {
    if (!this._isReadSpeakerActivated$.getValue()) {
      return;
    }
    const isFrenchColFirst = this._isFrenchColFirst$.getValue();
    const lang = (isFrenchColFirst && position === 1) || (!isFrenchColFirst && position === 2) ? 'fr' : 'ru';
    const text = (lang === 'fr') ? item.french : item.word;
    console.log('Text to speech: ' + lang + ', ' + text);
  }

  getVoice(TextMessage: string): Observable<any> {
    return this.http.post(`${this.baseUrl}`,
      {
        params: {
          msg: TextMessage,
          lang: "Tatyana",
          source: "ttsmp3"
        },
      });
  }

  getUrl(response: { id: string; }): string {
    return `https://freetts.com/audio/${response?.id}`;
  }

  get isReadSpeakerActivated$(): Observable<boolean> {
    return this._isReadSpeakerActivated$.asObservable();
  }

  setIsReadSpeakerActivated$(activated: boolean) {
    this._isReadSpeakerActivated$.next(activated);
  }

  get isPlaying$(): Observable<boolean> {
    return this._isPlaying$.asObservable();
  }

  setIsPlaying$(value: boolean) {
    this._isPlaying$.next(value);
  }

  get isSecondWordDisplayed$(): Observable<boolean> {
    return this._isSecondWordDisplayed$.asObservable();
  }

  setIsSecondWordDisplayed$(value: boolean) {
    this._isSecondWordDisplayed$.next(value);
  }
}
