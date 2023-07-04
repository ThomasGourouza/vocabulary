import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/models/item';
import { Observable } from 'rxjs';
import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html'
})
export class TableListComponent implements OnInit {
  @Input() items!: Item[];
  public showList = false;

  public isSourceColFirst$!: Observable<boolean>;

  constructor(
    private readerSpeakerService: ReaderSpeakerService
  ) { }

  ngOnInit(): void {
    this.isSourceColFirst$ = this.readerSpeakerService.isSourceColFirst$;
  }

  public toggleList() {
    this.showList = !this.showList && this.items.length > 0;
  }

  public onReadSpeak(item: Item): void {
    this.readerSpeakerService.textToSpeech(item, 2);
  }
}
