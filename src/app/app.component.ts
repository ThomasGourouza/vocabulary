import { Component, OnDestroy, OnInit } from '@angular/core';
import { Item } from './models/item';
import { ExcelService } from './services/excel.service';
import { Observable, Subscription, shareReplay } from 'rxjs';
import { Language } from './models/language';
import { Setting } from './models/setting.model';
import { SettingService } from './services/setting.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  public file$!: Observable<{ [tab: string]: Item[]; } | null>;
  public tab: string | undefined;
  public tag: string | undefined;
  public supportedLanguages: string[];

  private settingsSubscription = new Subscription();
  private addSettingSubscription = new Subscription();
  private settings: Setting[] = [];
  private newSetting: Setting = {
    id: 1,
    login: 'login',
    password: 'password',
    activations: [
      {
        tag: 'tag',
        tab: 'tab',
        activeItemIndexes: [1, 2, 3]
      }
    ]
  };

  constructor(
    private excelService: ExcelService,
    private settingService: SettingService
  ) {
    this.supportedLanguages = Object.keys(Language);
  }

  ngOnInit(): void {
    this.file$ = this.excelService.file$.pipe(shareReplay(1));
  }

  ngOnDestroy(): void {
    this.settingsSubscription?.unsubscribe();
    this.addSettingSubscription?.unsubscribe();
  }

  getAccounts() {
    this.settingService.getAccounts()
      .subscribe(response => {
        console.log(response);
      });
  }

  public getAccount() {
    this.settingsSubscription = this.settingService.getAccount("test", "test")
      .subscribe(response => {
        console.log(response);
      });
  }

  createAccount() {
    this.settingService.createAccount('test', 'test')
      .subscribe(response => {
        console.log(response);
      });
  }

  deleteAccount() {
    this.settingService.deleteAccount('test', 'test')
      .subscribe(response => {
        console.log(response);
      });
  }

  getSetting() {
    this.settingService.getSetting('test', 'test', 'tab', 'tag')
      .subscribe(response => {
        console.log(response);
      });
  }

  createSetting() {
    const activeItemIndexes = [1, 2, 3];
    this.settingService.createSetting('test', 'test', 'tab', 'tag', activeItemIndexes)
      .subscribe(response => {
        console.log(response);
      });
  }

  updateSetting() {
    const activeItemIndexes = [4, 5, 6];
    this.settingService.updateSetting('test', 'test', 'tab', 'tag', activeItemIndexes)
      .subscribe(response => {
        console.log(response);
      });
  }

  deleteSetting() {
    this.settingService.deleteSetting('test', 'test', 'tab', 'tag')
      .subscribe(response => {
        console.log(response);
      });
  }

  onTag(tag: string | undefined): void {
    this.tag = tag;
  }

  onTab(tab: string | undefined): void {
    this.tab = tab;
  }
}
