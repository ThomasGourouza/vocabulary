import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Item } from '../models/item';
import { Language } from '../models/language';

@Injectable()
export class ReaderSpeakerService {

  private synth!: SpeechSynthesisUtterance;
  private _isReadSpeakerActivated$ = new BehaviorSubject<boolean>(true);
  private _isPlaying$ = new BehaviorSubject<boolean>(false);
  private _isTargetDisplayed$ = new BehaviorSubject<boolean>(true);
  private _isSourceColFirst$ = new BehaviorSubject<boolean>(true);

  constructor() { }

  get isSourceColFirst$(): Observable<boolean> {
    return this._isSourceColFirst$.asObservable();
  }

  private speak(text: string, lang: string): void {
    this.synth = new SpeechSynthesisUtterance();
    this.synth.text = text;
    this.synth.lang = lang;
    this.synth.rate = 0.8;
    window.speechSynthesis.speak(this.synth);
  }

  textToSpeech(item: Item, position: 1 | 2): void {
    const language = Language[
      (position === 1 ? item.source_language : item.target_language)
        ?.toLowerCase() as keyof typeof Language
    ];
    const text = position === 1 ? item.source : item.target;
    this.speak(text, language);
  }

  signalEndOfPlay(): void {
    this.speak('End of the list', 'en-GB');
  }

  toggleIsSourceColFirst$() {
    if (this._isPlaying$.getValue() || !this._isTargetDisplayed$.getValue()) return;
    this._isSourceColFirst$.next(!this._isSourceColFirst$.getValue());
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
    if (!value) {
      this.cancelReadSpeak();
    }
  }

  get isTargetDisplayed$(): Observable<boolean> {
    return this._isTargetDisplayed$.asObservable();
  }

  setIsTargetDisplayed$(value: boolean) {
    this._isTargetDisplayed$.next(value);
  }

  cancelReadSpeak(): void {
    window.speechSynthesis.cancel();
  }
}
