import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Item } from '../models/item';
import { Language } from '../models/language';

@Injectable()
export class ReaderSpeakerService {

  private readonly baseUrl: string;
  private _isReadSpeakerActivated$ = new BehaviorSubject<boolean>(false);
  private _isPlaying$ = new BehaviorSubject<boolean>(false);
  private _isTargetDisplayed$ = new BehaviorSubject<boolean>(true);
  private _isSourceColFirst$ = new BehaviorSubject<boolean>(true);

  constructor(
    private readonly http: HttpClient
  ) {
    this.baseUrl = 'https://ttsmp3.com/makemp3_new.php';
  }

  get isSourceColFirst$(): Observable<boolean> {
    return this._isSourceColFirst$.asObservable();
  }

  toggleIsSourceColFirst$() {
    if (this._isPlaying$.getValue() || !this._isTargetDisplayed$.getValue()) {
      return;
    }
    this._isSourceColFirst$.next(!this._isSourceColFirst$.getValue());
  }

  textToSpeech(item: Item, position: 1 | 2): void {
    if (!this._isReadSpeakerActivated$.getValue()) {
      return;
    }
    const language = Language[
      (position === 1 ? item.source_language : item.target_language) as keyof typeof Language
    ];
    const text = position === 1 ? item.source : item.target
    console.log({ language, text });
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

  get isTargetDisplayed$(): Observable<boolean> {
    return this._isTargetDisplayed$.asObservable();
  }

  setIsTargetDisplayed$(value: boolean) {
    this._isTargetDisplayed$.next(value);
  }
}
