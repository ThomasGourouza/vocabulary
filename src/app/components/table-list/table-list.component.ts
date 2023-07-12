import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/models/item';
import { Observable } from 'rxjs';
import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';
import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

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
  public romaji = '感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！';

  public isSourceColFirst$!: Observable<boolean>;
  public isPlaying$!: Observable<boolean>;
  private kuroshiro = new Kuroshiro();
  private promise: Promise<void>;

  constructor(
    private readerSpeakerService: ReaderSpeakerService
  ) {
    this.promise = this.kuroshiro.init(new KuromojiAnalyzer({ dictPath: 'assets/dict' }));
  }

  ngOnInit(): void {
    this.isSourceColFirst$ = this.readerSpeakerService.isSourceColFirst$;
    this.isPlaying$ = this.readerSpeakerService.isPlaying$;

    this.promise.then(() =>
      this.kuroshiro.convert(this.romaji, { to: "romaji", mode: "furigana", romajiSystem: "hepburn" })
    ).then((result) =>
      this.romaji = result
    );

  }

  public toggleList() {
    this.showList = !this.showList && this.items.length > 0;
  }

  public onReadSpeak(item: Item): void {
    this.readerSpeakerService.textToSpeech(item, 2);
  }
}
