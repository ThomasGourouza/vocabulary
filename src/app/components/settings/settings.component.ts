import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ExcelService } from 'src/app/services/excel.service';
import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
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
  public isPlaying$!: Observable<boolean>;

  constructor(
    private excelService: ExcelService,
    private readerSpeakerService: ReaderSpeakerService
  ) { }

  ngOnInit(): void {
    this.isPlaying$ = this.readerSpeakerService.isPlaying$;
  }

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

  public onInterChange(): void {
    this.readerSpeakerService.toggleIsFrenchColFirst$();
  }
}
