import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExcelService } from 'src/app/services/excel.service';
import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent {
  private _priorities!: number[];
  get priorities(): number[] {
    return this._priorities;
  }
  @Input() set priorities(values: number[]) {
    this._priorities = values;
    if (this._priorities.length > 0) {
      this.priority.emit(+this._priorities[0]);
    }
  }
  @Input() showUpload!: boolean;
  @Output() priority = new EventEmitter<number>();

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

  public toggleSound(value: boolean): void {
    this.readerSpeakerService.setIsReadSpeakerActivated$(value);
  }
}
