import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/models/item';
import { Observable } from 'rxjs';
import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html'
})
export class TableListComponent implements OnInit {
  public _items!: Item[];
  get items(): Item[] {
    return this._items;
  }
  @Input() set items(values: Item[]) {
    this._items = values;
    if (this.items.length === 0) {
      this.showList = false;
    }
  }
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
