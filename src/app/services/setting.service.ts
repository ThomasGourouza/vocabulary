import { Injectable } from '@angular/core';
import { Setting } from '../models/setting.model';
import { Observable, map, of, switchMap } from 'rxjs';

@Injectable()
export class SettingService {

  constructor() { }

  public getAllSettings(): Observable<Setting[]> {
    return of([]);
  }

  public addSetting(setting: Setting): Observable<Setting[]> {
    return of([]);
  }
}
