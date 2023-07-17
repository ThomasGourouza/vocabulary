import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Item } from 'src/app/models/item';
import { Observable, Subscription, catchError, filter, of } from 'rxjs';
import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';
import { JapaneseWord, KuroshiroService } from '../../services/kuroshiro.service';
import { ItemsService } from 'src/app/services/items.service';
import { SettingApiService } from 'src/app/services/setting.api.service';
import { AccountService } from 'src/app/services/account.service';
import { Account } from 'src/app/models/setting.model';
export interface Data {
  items: Item[];
  tab: string | undefined;
  tag: string | undefined;
}

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html'
})
export class TableListComponent implements OnInit, OnDestroy {

  @Input() set data(data: Data) {
    this.items = data.items;
    this.itemsService.setItems$(this.items);
    if (this.items.length === 0) {
      this.showList = false;
    }
    this.settingExist = false;
    this.tab = data.tab;
    this.tag = data.tag;
    this.getSettings();
  }
  private tab: string | undefined;
  private tag: string | undefined;
  private settingExist = false;
  public items: Item[] = [];

  public showList = false;
  private account: Account | undefined;

  public isSourceColFirst$!: Observable<boolean>;
  public isPlaying$!: Observable<boolean>;
  public japaneseWords$!: Observable<JapaneseWord[]>;

  private getSettingSubscription = new Subscription();
  private createSettingSubscription = new Subscription();
  private updateSettingSubscription = new Subscription();
  private accountSubscription = new Subscription();

  constructor(
    private readerSpeakerService: ReaderSpeakerService,
    private kuroshiroService: KuroshiroService,
    private itemsService: ItemsService,
    private settingApiService: SettingApiService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.isSourceColFirst$ = this.readerSpeakerService.isSourceColFirst$;
    this.isPlaying$ = this.readerSpeakerService.isPlaying$;
    this.japaneseWords$ = this.kuroshiroService.japaneseWords$;
    this.accountSubscription = this.accountService.account$.subscribe(account => this.account = account);
  }

  ngOnDestroy(): void {
    this.getSettingSubscription?.unsubscribe();
    this.createSettingSubscription?.unsubscribe();
    this.updateSettingSubscription?.unsubscribe();
    this.accountSubscription?.unsubscribe();
  }

  get globalActive(): boolean {
    return this.items.length > 0 && this.items.every(item => item.active);
  }

  public toggleGlobalActive(active: boolean): void {
    if (!this.showList || this.items.length === 0) return;
    this.items.forEach(item => item.active = active);
    this.itemsService.setItems$(this.items);
    const indexes = active ? this.items.map((_, index) => index) : [];
    this.saveSettings(indexes);
  }

  public toggleActive(): void {
    this.itemsService.setItems$(this.items);
    const indexes = this.items
      .map((item, index) => item.active ? index : -1)
      .filter(index => index !== -1);
    this.saveSettings(indexes);
  }

  public toggleList() {
    this.showList = this.items.length > 0 && !this.showList;
  }

  public onReadSpeak(item: Item): void {
    this.readerSpeakerService.textToSpeech(item, 2);
  }

  // Settings API
  private saveSettings(indexes: number[]) {
    if (!!this.account) {
      if (this.tab !== undefined && this.tag !== undefined) {
        if (this.settingExist) {
          this.updateSetting(this.account, this.tab, this.tag, indexes);
        } else {
          this.createSetting(this.account, this.tab, this.tag, indexes);
        }
      }
    }
  }
  private createSetting(account: Account, tab: string, tag: string, activeItemIndexes: number[]): void {
    this.createSettingSubscription = this.settingApiService
      .createSetting(account.login, account.password, tab, tag, activeItemIndexes)
      .subscribe(_ => this.settingExist = true);
  }
  private updateSetting(account: Account, tab: string, tag: string, activeItemIndexes: number[]): void {
    this.updateSettingSubscription = this.settingApiService
      .updateSetting(account.login, account.password, tab, tag, activeItemIndexes)
      .subscribe();
  }
  private getSettings(): void {
    if (!!this.account && this.tab !== undefined && this.tag !== undefined) {
      this.getSettingSubscription = this.settingApiService
        .getSetting(this.account.login, this.account.password, this.tab, this.tag)
        .pipe(
          catchError(_ => of(null)),
          filter(setting => !!setting)
        )
        .subscribe(setting => {
          this.settingExist = true;
          this.items.forEach((item, index) =>
            item.active = setting!.activeItemIndexes.includes(index)
          );
          this.itemsService.setItems$(this.items);
        });
    }
  }
}
