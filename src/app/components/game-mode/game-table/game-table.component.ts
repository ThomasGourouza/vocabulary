import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from 'src/app/models/item';
import { JapaneseWord, KuroshiroService } from '../../../services/kuroshiro.service';
import { ItemsService } from 'src/app/services/items.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-table',
  templateUrl: './game-table.component.html'
})
export class GameTableComponent implements OnInit {
  @ViewChild('timerWrapper', { static: true }) timerWrapper!: ElementRef;
  @ViewChild('timer', { static: true }) timer!: ElementRef;
  @ViewChild('td', { static: true }) td!: ElementRef;

  private _item: Item | undefined;
  get item(): Item | undefined {
    return this._item;
  }
  @Input() set item(value: Item | undefined) {
    this._item = value;
    this.selectedIndex = undefined;
    this.answerIndex = undefined;
    this.updateGameList();
    setTimeout(() => {
      this.updateTimer(100);
    });
  }
  @Input() items!: Item[];
  @Input() showTarget!: boolean;
  @Input() isSourceColFirst!: boolean;

  public selectedIndex: number | undefined;
  public answerIndex: number | undefined;
  public gameList: Item[] = [];
  public japaneseWords$!: Observable<JapaneseWord[]>;

  constructor(
    private kuroshiroService: KuroshiroService,
    private itemsService: ItemsService,
    private gameService: GameService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.japaneseWords$ = this.kuroshiroService.japaneseWords$;
    this.gameService.isPlaying$.subscribe(isPlaying => {
      //
    });
  }

  public onSelect(gameItem: Item): void {
    this.selectedIndex = this.gameList.indexOf(gameItem);
    this.answerIndex = this.gameList.indexOf(this.item!);
    if (this.item?.source === gameItem.source && this.item?.target === gameItem.target) {
      this.gameService.setSuccess$(true);
    } else {
      this.gameService.setIsPlaying$(false);
    }
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

  private updateTimer(percentage: number) {
    const totalHeigth = this.td.nativeElement.offsetHeight;
    const TimerSize = (totalHeigth * percentage) / 100;
    this.renderer.setStyle(this.timerWrapper.nativeElement, 'transform', `translateY(calc((${totalHeigth}px - ${TimerSize}px) / 2))`);
    this.renderer.setStyle(this.timer.nativeElement, 'width', `${TimerSize}px`);
    this.renderer.setStyle(this.timer.nativeElement, 'transform', `translateX(calc((${TimerSize}px + 3px) / 2)) rotate(90deg)`);
  }
}
