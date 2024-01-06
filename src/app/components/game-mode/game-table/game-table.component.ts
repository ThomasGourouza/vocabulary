import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from 'src/app/models/item';
import { JapaneseWord, KuroshiroService } from '../../../services/kuroshiro.service';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-game-table',
  templateUrl: './game-table.component.html'
})
export class GameTableComponent implements OnInit {
  private _item: Item | undefined;
  get item(): Item | undefined {
    return this._item;
  }
  @Input() set item(value: Item | undefined) {
    this._item = value;
    this.updateGameList();
  }
  @Input() items!: Item[];
  @Input() showTarget!: boolean;
  @Input() isSourceColFirst!: boolean;

  public gameList: Item[] = [];
  public japaneseWords$!: Observable<JapaneseWord[]>;

  constructor(
    private kuroshiroService: KuroshiroService,
    private itemsService: ItemsService,
  ) { }

  ngOnInit(): void {
    this.japaneseWords$ = this.kuroshiroService.japaneseWords$;
  }

  private updateGameList(): void {
    const itemIndex = this.items.findIndex((item) => item.source === this.item?.source && item.target === this.item?.target);
    if (itemIndex === -1) {
      return;
    }
    let secondIndex: number;
    let thirdIndex: number;
    do {
      secondIndex = this.itemsService.getRandomInt(this.items.length);
    } while (secondIndex === itemIndex);
    do {
      thirdIndex = this.itemsService.getRandomInt(this.items.length);
    } while (thirdIndex === itemIndex || thirdIndex === secondIndex);

    const itemIndexInGameList = this.itemsService.getRandomInt(3);
    this.gameList = [];
    switch(itemIndexInGameList) {
      case 0:
        this.gameList.push(this.items[itemIndex], this.items[secondIndex], this.items[thirdIndex]);
        break;
      case 1:
        this.gameList.push(this.items[secondIndex], this.items[itemIndex], this.items[thirdIndex]);
        break;
      default:
        this.gameList.push(this.items[secondIndex], this.items[thirdIndex], this.items[itemIndex]);
        break;
    }
  }
}
