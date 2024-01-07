import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class GameService {
  constructor() { }

  private _success$ = new BehaviorSubject<boolean>(false);
  private _failure$ = new BehaviorSubject<boolean>(false);
  private _isPlaying$ = new BehaviorSubject<boolean>(false);
  private _timer$ = new BehaviorSubject<boolean>(false);

  get success$(): Observable<boolean> {
    return this._success$.asObservable();
  }

  public setSuccess$(success: boolean): void {
    this._success$.next(success);
  }

  get failure$(): Observable<boolean> {
    return this._failure$.asObservable();
  }

  public setFailure$(failure: boolean): void {
    this._failure$.next(failure);
  }

  get isPlaying$(): Observable<boolean> {
    return this._isPlaying$.asObservable();
  }

  public setIsPlaying$(isPlaying: boolean): void {
    this._isPlaying$.next(isPlaying);
  }

  get timer$(): Observable<boolean> {
    return this._timer$.asObservable();
  }

  public setTimer$(timer: boolean): void {
    this._timer$.next(timer);
  }
}
