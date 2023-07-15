import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/models/item';
import { Observable } from 'rxjs';
import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';
import { JapaneseWord, KuroshiroService } from '../../services/kuroshiro.service';
import { ItemsService } from 'src/app/services/items.service';

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
    this.itemsService.setItems$(this.items);
    if (this.items.length === 0) {
      this.showList = false;
    }
  }
  public showList = false;

  public isSourceColFirst$!: Observable<boolean>;
  public isPlaying$!: Observable<boolean>;
  public japaneseWords$!: Observable<JapaneseWord[]>;

  constructor(
    private readerSpeakerService: ReaderSpeakerService,
    private kuroshiroService: KuroshiroService,
    private itemsService: ItemsService
  ) {}

  ngOnInit(): void {
    this.isSourceColFirst$ = this.readerSpeakerService.isSourceColFirst$;
    this.isPlaying$ = this.readerSpeakerService.isPlaying$;
    this.japaneseWords$ = this.kuroshiroService.japaneseWords$;
  }

  get globalActive(): boolean {
    return this.items.length > 0 && this.items.every(item => item.active);
  }

  public toggleGlobalActive(active: boolean): void {
    this.items.forEach(item => item.active = active);
    this.itemsService.setItems$(this.items);
  }

  public toggleList() {
    this.showList = this.items.length > 0 && !this.showList;
  }

  public onReadSpeak(item: Item): void {
    this.readerSpeakerService.textToSpeech(item, 2);
  }

  public toggleActive(): void {
    this.itemsService.setItems$(this.items);
  }
}
