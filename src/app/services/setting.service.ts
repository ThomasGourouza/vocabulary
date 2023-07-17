import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Account, Setting } from '../models/setting.model';

@Injectable()
export class SettingService {
  private baseURL = 'https://thomas-gourouza.com/api/';
  private settingURL = 'setting.php';
  private accountURL = 'account.php';

  constructor(private http: HttpClient) { }

  public getAccount(login: string, password: string): Observable<Account> {
    const url = `${this.baseURL}${this.accountURL}?login=${login}&password=${password}`;
    return this.http.get<Account>(url);
  }

  public createAccount(login: string, password: string) {
    const accountData = { login, password };
    return this.http.post(`${this.baseURL}${this.accountURL}`, accountData);
  }

  public deleteAccount(login: string, password: string) {
    const url = `${this.baseURL}${this.accountURL}?login=${login}&password=${password}`;
    return this.http.delete(url);
  }

  public getSetting(login: string, password: string, tab: string, tag: string): Observable<Setting> {
    const url = `${this.baseURL}${this.settingURL}?login=${login}&password=${password}&tab=${tab}&tag=${tag}`;
    return this.http.get<Setting>(url)
      .pipe(
        map(value => {
          value.activeItemIndexes = JSON.parse(value.activeItemIndexes as unknown as string) as number[];
          return value;
        })
      );
  }

  public createSetting(login: string, password: string, tab: string, tag: string, activeItemIndexes: number[]) {
    const settingData = { tab, tag, activeItemIndexes };
    const url = `${this.baseURL}${this.settingURL}?login=${login}&password=${password}`;
    return this.http.post(url, settingData);
  }

  public updateSetting(login: string, password: string, tab: string, tag: string, activeItemIndexes: number[]) {
    const settingData = { activeItemIndexes };
    const url = `${this.baseURL}${this.settingURL}?login=${login}&password=${password}&tab=${tab}&tag=${tag}`;
    return this.http.patch(url, settingData);
  }
}
