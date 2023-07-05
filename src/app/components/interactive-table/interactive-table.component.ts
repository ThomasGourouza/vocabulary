import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, interval, shareReplay } from 'rxjs';
import { Item } from 'src/app/models/item';
import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';
import { WakelockService } from 'src/app/services/wakelock.service';
export interface Index {
  previousNumber: number | undefined;
  nextNumber: number | undefined;
  number: number | undefined;
  showTarget: boolean;
  counter: number;
}

@Component({
  selector: 'app-interactive-table',
  templateUrl: './interactive-table.component.html'
})
export class InteractiveTableComponent implements OnInit, OnDestroy {
  public _items!: Item[];
  get items(): Item[] {
    return this._items;
  }
  @Input() set items(values: Item[]) {
    this._items = values;
    this.currentIndex = {
      previousNumber: undefined,
      nextNumber: undefined,
      number: undefined,
      showTarget: false,
      counter: 0
    };
    this.isDataEmpty = this.items.length === 0;
    this.memory = [];
    this.onPause();
    this.readerSpeakerService.setIsTargetDisplayed$(true);
    this.next();
  }

  public currentIndex!: Index;
  public isPlaying = false;
  public times = [3000, 5000, 7000];
  public time = this.times[1];
  private memory: number[] = [];
  public isSourceColFirst!: boolean;
  public isDataEmpty = true;
  public isReadSpeakerActivated!: boolean;

  public isTargetDisplayed$!: Observable<boolean>;
  public isSourceColFirstSubscription = new Subscription();
  private timeSubscription = new Subscription();
  private isPlayingSubscription = new Subscription();
  private isReadSpeakerActivatedSubscription = new Subscription();

  constructor(
    private readerSpeakerService: ReaderSpeakerService,
    private wakelockService: WakelockService
  ) { }

  ngOnInit(): void {
    this.isTargetDisplayed$ = this.readerSpeakerService.isTargetDisplayed$.pipe(shareReplay(1));
    this.isReadSpeakerActivatedSubscription = this.readerSpeakerService.isReadSpeakerActivated$
      .subscribe(value => this.isReadSpeakerActivated = value);
    this.isSourceColFirstSubscription = this.readerSpeakerService.isSourceColFirst$
      .subscribe(value => this.isSourceColFirst = value);
    this.isPlayingSubscription = this.readerSpeakerService.isPlaying$
      .subscribe(value => this.isPlaying = value);
  }

  ngOnDestroy(): void {
    this.timeSubscription.unsubscribe();
    this.isPlayingSubscription.unsubscribe();
    this.isSourceColFirstSubscription.unsubscribe();
    this.isReadSpeakerActivatedSubscription.unsubscribe();
    this.wakelockService.releaseWakeLock();
  }

  public onInterChange(): void {
    this.readerSpeakerService.toggleIsSourceColFirst$();
  }

  public onNext(): void {
    if (this.isPlaying || this.isDataEmpty) return;
    this.next();
  }

  private next(): void {
    if (this.items.length === 0) return;
    if (!this.currentIndex.showTarget && this.currentIndex.number !== undefined) {
      this.currentIndex.showTarget = true;
      if (this.isReadSpeakerActivated) {
        this.readerSpeakerService.textToSpeech(this.items[this.currentIndex.number], this.isSourceColFirst ? 2 : 1);
      }
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
      if (this.isReadSpeakerActivated) {
        this.readerSpeakerService.textToSpeech(this.items[number], this.isSourceColFirst ? 1 : 2);
      }
    }
    this.readerSpeakerService.setIsTargetDisplayed$(this.currentIndex.showTarget);
  }

  public getRandomIndex(): number {
    if (this.memory.length === this.items.length) {
      this.memory = [];
    }
    let randomIndex: number;
    do {
      randomIndex = this.getRandomInt(this.items.length);
    } while (this.memory.includes(randomIndex));
    this.memory.push(randomIndex);
    return randomIndex;
  }

  public onPrevious(): void {
    if (this.isPlaying
      || this.isDataEmpty
      || this.currentIndex.counter === 1
      || this.currentIndex.previousNumber === undefined
    ) return;
    const nextNumber = this.currentIndex.number;
    const number = this.currentIndex.previousNumber;
    this.currentIndex = {
      previousNumber: undefined,
      nextNumber,
      number,
      showTarget: true,
      counter: this.currentIndex.counter - 1
    };
  }

  public onPlay(): void {
    if (this.isDataEmpty) return;
    this.wakelockService.requestWakeLock();
    this.readerSpeakerService.setIsPlaying$(true);
    this.next();
    this.timeSubscription = interval(this.time).subscribe(() => {
      this.next();
      if (this.currentIndex.counter % this.items.length === 0 && this.currentIndex.showTarget) {
        this.onPause();
      }
    });
  }

  public onPause(): void {
    this.readerSpeakerService.setIsPlaying$(false);
    this.timeSubscription.unsubscribe();
    this.wakelockService.releaseWakeLock();
  }

  public onReadSpeak(index: number): void {
    this.readerSpeakerService.textToSpeech(this.items[index], 2);
  }

  private getRandomInt(exclusiveMax: number): number {
    return Math.floor(Math.random() * exclusiveMax);
  }
}
