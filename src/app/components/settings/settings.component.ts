import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ExcelService } from 'src/app/services/excel.service';
import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent {
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

  constructor(
    private excelService: ExcelService,
    private readerSpeakerService: ReaderSpeakerService
  ) { }

  public onUploadData(file: File): void {
    this.excelService.excelToJSON(file);
  }

  public onReset(): void {
    this.excelService.reset();
  }

  public onChangePriority(priority: EventTarget | null): void {
    if (!!priority) {
      this.priority.emit(+(priority as HTMLSelectElement).value);
    }
  }

  public onChangeTab(tab: EventTarget | null): void {
    if (!!tab) {
      this.tab.emit((tab as HTMLSelectElement).value);
    }
  }

  public toggleSound(value: boolean): void {
    this.readerSpeakerService.setIsReadSpeakerActivated$(value);
  }
}
