import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ExcelService } from 'src/app/services/excel.service';
import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, catchError, filter, map, of, shareReplay } from 'rxjs';
import { Text } from 'src/app/models/text';
import { SettingApiService } from 'src/app/services/setting.api.service';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit, OnDestroy {
  @Input() set tabs(values: string[]) {
    this._tabs = values.map(tag => tag.toString());
    if (this.tabs.length === 0) {
      this.tab.emit(undefined);
    } else {
      const localStorageTab = localStorage.getItem('vocabularyAppTab');
      if (!!localStorageTab && this.tabs.includes(localStorageTab)) {
        this.selectedTab = localStorageTab;
        this.tab.emit(this.selectedTab);
      }
    }
  }
  @Input() set tags(values: string[]) {
    this._tags = values.map(tag => tag.toString());
    if (this.tags.length === 0) {
      this.tag.emit(undefined);
    } else {
      const localStorageTag = localStorage.getItem('vocabularyAppTag');
      if (!!localStorageTag && this.tags.includes(localStorageTag)) {
        this.selectedTag = localStorageTag;
        this.tag.emit(this.selectedTag);
      } else {
        this.tag.emit(undefined);
      }
    }
  }
  @Output() tab = new EventEmitter<string>();
  @Output() tag = new EventEmitter<string>();

  public selectedTab: string | undefined;
  public selectedTag: string | undefined;

  private _tabs!: string[];
  get tabs(): string[] {
    return this._tabs;
  }
  private _tags!: string[];
  get tags(): string[] {
    return this._tags;
  }

  public signinForm: FormGroup;
  public registerForm: FormGroup;

  public isPlaying$!: Observable<boolean>;

  public isFileUploadVisible = true;
  private httpSubscription = new Subscription();
  public isAccountDialogVisible = false;

  private signinSubscription = new Subscription();
  private registerSubscription = new Subscription();
  public login$!: Observable<string | undefined>;

  constructor(
    private excelService: ExcelService,
    private readerSpeakerService: ReaderSpeakerService,
    private confirmationService: ConfirmationService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private settingApiService: SettingApiService,
    private accountService: AccountService
  ) {
    this.signinForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.registerForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadFile();
    this.isPlaying$ = this.readerSpeakerService.isPlaying$;
    this.login$ = this.accountService.account$.pipe(
      map(account => account?.login),
      shareReplay(1)
    );
    const localStorageLogin = localStorage.getItem('vocabularyAppLogin');
    const localStoragePassword = localStorage.getItem('vocabularyAppPassword');
    if (!!localStorageLogin && !!localStoragePassword) {
      this.signinForm.controls['login'].setValue(localStorageLogin);
      this.signinForm.controls['password'].setValue(localStoragePassword);
      this.onSignIn();
    }
  }

  ngOnDestroy(): void {
    this.httpSubscription?.unsubscribe();
    this.signinSubscription?.unsubscribe();
    this.registerSubscription?.unsubscribe();
  }

  public onSignout(): void {
    this.confirmationService.confirm({
      message: "Sign out ?",
      icon: "pi pi-sign-out",
      accept: () => {
        this.accountService.setAccount$(undefined);
        this.removeAccountLocalStorage();
        this.messageService.add({ severity: 'warn', summary: Text.logout });
      }
    });
  }

  public onSignIn(): void {
    if (this.signinForm.valid) {
      this.messageService.clear();
      const formValues = this.signinForm.value;
      const login = formValues.login;
      const password = formValues.password;
      this.signinSubscription = this.settingApiService.getAccount(login, password)
        .pipe(
          catchError(error => {
            this.messageService.add({ severity: 'error', summary: error?.error?.message ?? Text.unableSignIn });
            return of(null);
          }),
          filter(setting => !!setting)
        )
        .subscribe(account => {
          this.setAccountLocalStorage(login, password);
          this.isAccountDialogVisible = false;
          this.messageService.add({ severity: 'success', summary: Text.successLogin });
          this.accountService.setAccount$(account!);
          this.signinForm.reset();
        });
    }
  }

  public onRegister(): void {
    if (this.registerForm.valid) {
      this.messageService.clear();
      const formValues = this.registerForm.value;
      const login = formValues.login;
      const password = formValues.password;
      this.registerSubscription = this.settingApiService.createAccount(login, password)
        .pipe(
          catchError(error => {
            this.messageService.add({ severity: 'error', summary: error?.error?.message ?? Text.unableRegister });
            return of(null);
          }),
          filter(setting => !!setting)
        )
        .subscribe(response => {
          this.setAccountLocalStorage(login, password);
          this.isAccountDialogVisible = false;
          this.messageService.add({ severity: 'success', summary: response!.message });
          const account = {
            id: +response!.account_id,
            login,
            password
          }
          this.accountService.setAccount$(account);
          this.registerForm.reset();
        });
    }
  }

  public onAccount(): void {
    this.isAccountDialogVisible = true;
  }

  private loadFile() {
    this.isFileUploadVisible = false;
    this.httpSubscription = this.http.get('assets/language-file.xlsx', { responseType: 'blob' })
      .subscribe((data: Blob) => {
        this.onUploadData(data as File);
      });
  }

  public onUploadData(file: File): void {
    this.isFileUploadVisible = false;
    setTimeout(() => {
      this.isFileUploadVisible = true;
    }, 1000);
    this.excelService.excelToJSON(file);
  }

  public onReset(): void {
    this.confirmationService.confirm({
      message: "Remove file ?",
      icon: "pi pi-trash",
      accept: () => this.excelService.reset()
    });
  }

  public onChangeTag(tag: EventTarget | null): void {
    if (tag !== null && tag !== undefined) {
      this.tagEmitter((tag as HTMLSelectElement)?.value);
    }
  }

  public onChangeTab(tab: EventTarget | null): void {
    if (tab !== null && tab !== undefined) {
      this.tagEmitter(undefined);
      this.tabEmitter(undefined);
      setTimeout(() => {
        this.tabEmitter((tab as HTMLSelectElement)?.value);
      });
    }
  }

  get isSoundActivated(): Observable<boolean> {
    return this.readerSpeakerService.isReadSpeakerActivated$
  }

  public toggleSound(value: boolean): void {
    this.readerSpeakerService.setIsReadSpeakerActivated$(value);
  }

  public onDownload() {
    this.confirmationService.confirm({
      message: "Download excel file ?",
      icon: "pi pi-download",
      accept: () => this.download()
    });
  }

  private download() {
    this.http.get('assets/language-file.xlsx', { responseType: 'blob' })
      .subscribe((data: Blob) => {
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(data);
        downloadLink.setAttribute('download', 'russian-vocabulary.xlsx');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      });
  }

  private setAccountLocalStorage(login: string, password: string): void {
    localStorage.setItem('vocabularyAppLogin', login);
    localStorage.setItem('vocabularyAppPassword', password);
  }

  private removeAccountLocalStorage(): void {
    localStorage.removeItem('vocabularyAppLogin');
    localStorage.removeItem('vocabularyAppPassword');
  }

  private tabEmitter(tab: string | undefined): void {
    this.tab.emit(tab);
    if (tab !== undefined) {
      localStorage.setItem('vocabularyAppTab', tab);
    }
  }

  private tagEmitter(tag: string | undefined): void {
    this.tag.emit(tag);
    if (tag !== undefined) {
      localStorage.setItem('vocabularyAppTag', tag);
    } else {
      localStorage.removeItem('vocabularyAppTag');
    }
  }
}
