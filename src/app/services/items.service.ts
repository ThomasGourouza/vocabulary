import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Item } from '../models/item';

@Injectable()
export class ItemsService {
  constructor() { }

  private _items$ = new BehaviorSubject<Item[]>([]);

  get items$(): Observable<Item[]> {
    return this._items$.asObservable()
      .pipe(
        map(items => items?.filter(item => item.active))
      );
  }

  public setItems$(items: Item[]): void {
    this._items$.next(items);
  }

  public getRandomInt(exclusiveMax: number): number {
    return Math.floor(Math.random() * exclusiveMax);
  }
}
