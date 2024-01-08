import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { Observable, Subscription, interval, map } from 'rxjs';
import { Item } from 'src/app/models/item';
import { JapaneseWord, KuroshiroService } from '../../../services/kuroshiro.service';
import { ItemsService } from 'src/app/services/items.service';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game-table',
  templateUrl: './game-table.component.html'
})
export class GameTableComponent implements OnInit, OnDestroy {
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
  }
  @Input() items!: Item[];
  @Input() showTarget!: boolean;
  @Input() isSourceColFirst!: boolean;

  public selectedIndex: number | undefined;
  public answerIndex: number | undefined;
  public clickable = true;
  public gameList: Item[] = [];
  public japaneseWords$!: Observable<JapaneseWord[]>;
  private timeSubscription = new Subscription();

  constructor(
    private kuroshiroService: KuroshiroService,
    private itemsService: ItemsService,
    private gameService: GameService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.japaneseWords$ = this.kuroshiroService.japaneseWords$;
    this.gameService.isPlaying$.subscribe(isPlaying => {
      this.clickable = isPlaying;
    });
    this.gameService.timer$.subscribe(value => {
      if (value) {
        this.runTime();
      } else {
        this.updateTimer(0);
        this.timeSubscription.unsubscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.timeSubscription.unsubscribe();
  }

  public onSelect(gameItem: Item): void {
    if (!this.clickable) {
      return;
    }
    this.clickable = false;
    this.gameService.setTimer$(false);
    this.selectedIndex = this.gameList.indexOf(gameItem);
    this.answerIndex = this.gameList.indexOf(this.item!);
    if (this.item?.source === gameItem.source && this.item?.target === gameItem.target) {
      this.gameService.setSuccess$(true);
      setTimeout(() => {
        this.clickable = true;
      }, 500);
    } else {
      this.gameOver();
    }
  }

  public isSuccess(i: number, gameItem: Item): boolean {
    return this.answerIndex === i ||
      (this.selectedIndex === i &&
        this.item?.source === gameItem.source &&
        this.item?.target === gameItem.target);
  }

  public isFailure(i: number, gameItem: Item): boolean {
    return this.selectedIndex === i &&
      (this.item?.source !== gameItem.source ||
        this.item?.target !== gameItem.target);
  }

  private gameOver(): void {
    this.clickable = false;
    this.gameService.setTimer$(false);
    setTimeout(() => {
      this.gameService.setIsPlaying$(false);
      this.gameService.setFailure$(true);
    }, 500);
  }

  private runTime(): void {
    this.updateTimer(3);
    this.timeSubscription = interval(10)
      .pipe(
        map(t => 3 - (t / 100))
      ).subscribe(time => {
        this.updateTimer(time);
        if (time === 0) {
          this.gameOver();
        }
      });
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
    switch (itemIndexInGameList) {
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

  private updateTimer(time: number) {
    const totalHeigth = this.td.nativeElement.offsetHeight;
    const TimerSize = (totalHeigth * time) / 3;
    this.renderer.setStyle(this.timerWrapper.nativeElement, 'transform', `translateY(calc((${totalHeigth}px - ${TimerSize}px) / 2))`);
    this.renderer.setStyle(this.timer.nativeElement, 'width', `${TimerSize}px`);
    this.renderer.setStyle(this.timer.nativeElement, 'transform', `translateX(calc((${TimerSize}px + 3px) / 2)) rotate(90deg)`);
  }
}
