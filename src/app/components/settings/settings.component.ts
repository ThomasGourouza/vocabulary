import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ExcelService } from 'src/app/services/excel.service';
import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit, OnDestroy {
  @Input() set tabs(values: (string | number)[]) {
    this._tabs = values as string[];
    if (this.tabs.length === 0) {
      this.tab.emit(undefined);
    }
  }
  @Input() set priorities(values: (string | number)[]) {
    this._priorities = values as number[];
    if (this.priorities.length === 0) {
      this.priority.emit(undefined);
    }
  }
  @Output() tab = new EventEmitter<string>();
  @Output() priority = new EventEmitter<number>();

  private _tabs!: string[];
  get tabs(): string[] {
    return this._tabs;
  }
  private _priorities!: number[];
  get priorities(): number[] {
    return this._priorities;
  }

  public isPlaying$!: Observable<boolean>;

  public isFileUploadVisible = true;
  private httpSubscription = new Subscription();

  constructor(
    private excelService: ExcelService,
    private readerSpeakerService: ReaderSpeakerService,
    private confirmationService: ConfirmationService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadFile();
    this.isPlaying$ = this.readerSpeakerService.isPlaying$;
  }

  ngOnDestroy(): void {
    this.httpSubscription.unsubscribe();
  }

  private loadFile() {
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

  public onChangePriority(priority: EventTarget | null): void {
    if (!!priority) {
      this.priority.emit(+(priority as HTMLSelectElement).value);
    }
  }

  public onChangeTab(tab: EventTarget | null): void {
    if (!!tab) {
      this.tab.emit(undefined);
      this.priority.emit(undefined);
      setTimeout(() => {
        this.tab.emit((tab as HTMLSelectElement)?.value);
      });
    }
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
}
