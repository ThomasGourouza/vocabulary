import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription, filter, interval, shareReplay, tap } from 'rxjs';
import { Index } from 'src/app/models/index';
import { Item } from 'src/app/models/item';
import { ItemsService } from 'src/app/services/items.service';
import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';

@Component({
  selector: 'app-game-mode',
  templateUrl: './game-mode.component.html'
})
export class GameModeComponent implements OnInit, OnDestroy {
  @Output() gameMode = new EventEmitter<boolean>();
  public items: Item[] = [];
  public currentIndex!: Index;

  private memory: number[] = [];
  public isSourceColFirst!: boolean;
  public isEnoughData = true;
  public progress = 0;
  public isFirstProgress = true;

  public isTargetDisplayed$!: Observable<boolean>;
  public isSourceColFirstSubscription = new Subscription();
  private itemsSubscription = new Subscription();
  private timeSubscription = new Subscription();

  constructor(
    private itemsService: ItemsService,
    private readerSpeakerService: ReaderSpeakerService
  ) { }

  ngOnInit(): void {
    this.itemsSubscription = this.itemsService.items$.subscribe(items => {
      this.items = items;
      this.currentIndex = {
        previousNumber: undefined,
        nextNumber: undefined,
        number: undefined,
        showTarget: false,
        counter: 0
      };
      this.isEnoughData = this.items.length >= 3;
      this.memory = [];
      this.isFirstProgress = !this.isFirstProgress;
      this.progress = 0;
      setTimeout(() => { this.updateProgress(); }, 10);
    });
    this.isTargetDisplayed$ = this.readerSpeakerService.isTargetDisplayed$.pipe(shareReplay(1));
    this.isSourceColFirstSubscription = this.readerSpeakerService.isSourceColFirst$
      .subscribe(value => this.isSourceColFirst = value);
  }

  ngOnDestroy(): void {
    this.itemsSubscription.unsubscribe();
    this.timeSubscription.unsubscribe();
    this.isSourceColFirstSubscription.unsubscribe();
  }

  public onInterChange(): void {
    this.readerSpeakerService.toggleIsSourceColFirst$();
  }

  public onRefresh(): void {
    this.ngOnInit();
  }

  public onNoGameMode(): void {
    this.gameMode.emit(false);
  }

  public onPlay(): void {
    if (this.isEnoughData) {
      this.next();
    }
  }

  private next(): void {
    if (this.items.length === 0) return;
    if (!this.currentIndex.showTarget && this.currentIndex.number !== undefined) {
      this.currentIndex.showTarget = true;
    } else {
      const previousNumber = this.currentIndex.number;
      const number = this.currentIndex.nextNumber ?? this.getRandomIndex();
      this.currentIndex = {
        previousNumber,
        nextNumber: undefined,
        number,
        showTarget: false,
        counter: this.currentIndex.counter + 1
      };
      this.updateProgressNext();
    }
    this.readerSpeakerService.setIsTargetDisplayed$(this.currentIndex.showTarget);
  }

  public getRandomIndex(): number {
    if (this.memory.length === this.items.length) {
      this.memory = [];
    }
    let randomIndex: number;
    do {
      randomIndex = this.itemsService.getRandomInt(this.items.length);
    } while (this.memory.includes(randomIndex));
    this.memory.push(randomIndex);
    return randomIndex;
  }

  private updateProgressNext(): void {
    const counter = this.currentIndex.counter;
    if (counter === 0) {
      this.progress = 0;
    } else if (counter % this.items.length === 0) {
      this.progress = 100;
    } else {
      if (this.progress === 100) {
        this.isFirstProgress = !this.isFirstProgress;
        this.progress = 0;
      }
      setTimeout(() => { this.updateProgress(); }, 10);
    }
  }

  private updateProgress(): void {
    const itemCount = this.items.length;
    this.progress = (this.currentIndex.counter % itemCount) * (100 / itemCount);
  }
}
