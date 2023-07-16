import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SettingService {
  private settingURL = 'https://thomas-gourouza.com/api/setting.php';
  private accountsURL = 'https://thomas-gourouza.com/api/accounts.php';
  private accountURL = 'https://thomas-gourouza.com/api/account.php';

  constructor(private http: HttpClient) { }

  getAccounts() {
    return this.http.get(this.accountsURL);
  }

  getAccount(login: string, password: string) {
    const url = `${this.accountURL}?login=${login}&password=${password}`;
    return this.http.get(url);
  }

  createAccount(login: string, password: string) {
    const accountData = { login, password };
    return this.http.post(this.accountURL, accountData);
  }

  deleteAccount(login: string, password: string) {
    const url = `${this.accountURL}?login=${login}&password=${password}`;
    return this.http.delete(url);
  }

  getSetting(login: string, password: string, tab: string, tag: string) {
    const url = `${this.settingURL}?login=${login}&password=${password}&tab=${tab}&tag=${tag}`;
    return this.http.get(url);
  }

  createSetting(login: string, password: string, tab: string, tag: string, activeItemIndexes: number[]) {
    const settingData = { tab, tag, activeItemIndexes };
    const url = `${this.settingURL}?login=${login}&password=${password}`;
    return this.http.post(url, settingData);
  }

  updateSetting(login: string, password: string, tab: string, tag: string, activeItemIndexes: number[]) {
    const settingData = { activeItemIndexes };
    const url = `${this.settingURL}?login=${login}&password=${password}&tab=${tab}&tag=${tag}`;
    return this.http.patch(url, settingData);
  }

  deleteSetting(login: string, password: string, tab: string, tag: string) {
    const url = `${this.settingURL}?login=${login}&password=${password}&tab=${tab}&tag=${tag}`;
    return this.http.delete(url);
  }
}
