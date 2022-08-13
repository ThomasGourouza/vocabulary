import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Index } from '../models';
import { Grammar } from '../models/grammar';
import { InfoLabel } from '../models/info-label';

@Injectable()
export class GrammarService {

  private _name!: string;
  private _tabIndex!: number;
  private _validKeys!: Array<string>;
  private _infoLabel!: InfoLabel;

  private _data$ = new Subject<Array<Grammar>>();
  private _selectedData$ = new Subject<Array<Grammar>>();
  private _currentItem$ = new Subject<Grammar | undefined>();
  private _index$ = new Subject<Index>();
  private _firstNext$ = new Subject<boolean>();
  private _priority$ = new Subject<number | undefined>();
  private _counter$ = new Subject<number>();
  private _isValidData$ = new Subject<boolean>();

  private _memory: Array<number> = [];
  private _lastInMemory: number | undefined;

  constructor() {
    this.initVariables();
  }

  get name(): string {
    return this._name;
  }

  get tabIndex(): number {
    return this._tabIndex;
  }

  get validKeys(): Array<string> {
    return this._validKeys;
  }

  get infoLabel(): InfoLabel {
    return this._infoLabel;
  }

  get data$(): Observable<Array<Grammar>> {
    return this._data$.asObservable();
  }
  setData$(data: Array<Grammar>): void {
    this._data$.next(data);
  }

  get selectedData$(): Observable<Array<Grammar>> {
    return this._selectedData$.asObservable();
  }
  setSelectedData$(selectedData: Array<Grammar>): void {
    this._selectedData$.next(selectedData);
  }

  get currentItem$(): Observable<Grammar | undefined> {
    return this._currentItem$.asObservable();
  }
  setCurrentItem$(currentItem: Grammar | undefined): void {
    this._currentItem$.next(currentItem);
  }

  get index$(): Observable<Index> {
    return this._index$.asObservable();
  }
  setIndex$(index: Index): void {
    this._index$.next(index);
  }

  get firstNext$(): Observable<boolean> {
    return this._firstNext$.asObservable();
  }
  setFirstNext$(firstNext: boolean): void {
    this._firstNext$.next(firstNext);
  }

  get priority$(): Observable<number | undefined> {
    return this._priority$.asObservable();
  }
  setPriority$(priority: number | undefined): void {
    this._priority$.next(priority);
  }

  get counter$(): Observable<number> {
    return this._counter$.asObservable();
  }
  setCounter$(counter: number): void {
    this._counter$.next(counter);
  }

  get isValidData$(): Observable<boolean> {
    return this._isValidData$.asObservable();
  }
  setIsValidData$(isValidData: boolean): void {
    this._isValidData$.next(isValidData);
  }

  public setProperties(name: string, tabIndex: number, validKeys: Array<string>, infoLabel: InfoLabel): void {
    this._name = name;
    this._tabIndex = tabIndex;
    this._validKeys = validKeys;
    this._infoLabel = infoLabel;
  }

  public initVariables(): void {
    this._data$.next([]);
    this._selectedData$.next([]);
    this._currentItem$.next();
    this._index$.next({ previous: undefined, current: undefined, next: undefined });
    this._firstNext$.next(true);
    this._priority$.next();
    this._counter$.next(0);
    this._isValidData$.next(true);
  }

  public getNext(length: number): number {
    if (length <= 0) {
      return 0;
    }
    this._lastInMemory = undefined;
    if (this._memory.length === length) {
      this._lastInMemory = this._memory.pop();
      this._memory = [];
    }
    let array: Array<number> = [];
    for (let i = 0; i < length; i++) {
      array.push(i);
    }
    const leftIndexes = array.filter((index) => !this._memory.includes(index));
    let randomIndex = 0;
    do {
      randomIndex = leftIndexes[this.getRandomInt(leftIndexes.length)];
    } while (randomIndex === this._lastInMemory);
    this._memory.push(randomIndex);
    return randomIndex;
  }

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

}
