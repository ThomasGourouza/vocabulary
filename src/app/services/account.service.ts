import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Account } from '../models/setting.model';

@Injectable()
export class AccountService {
  constructor() { }

  private _account$ = new Subject<Account | undefined>();

  get account$(): Observable<Account | undefined> {
    return this._account$.asObservable();
  }

  public setAccount$(account: Account | undefined): void {
    this._account$.next(account);
  }
}
