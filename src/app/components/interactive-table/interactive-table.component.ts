import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, interval, shareReplay } from 'rxjs';
import { Item } from 'src/app/models/item';
import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';
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
    if ([0, 1].includes(this.items.length)) {
      this.currentIndex = {
        previousNumber: undefined,
        nextNumber: undefined,
        number: undefined,
        showTarget: false,
        counter: 0
      };
      this.memory = [];
      this.onPause();
      this.readerSpeakerService.setIsTargetDisplayed$(true);
    } else {
      this.next();
    }
  }

  public currentIndex!: Index;
  public isPlaying = false;
  public times = [2000, 3000, 5000, 10000];
  public time = this.times[0];
  private memory: number[] = [];
  public isSourceColFirst!: boolean;

  public isReadSpeakerActivated$!: Observable<boolean>;
  public isTargetDisplayed$!: Observable<boolean>;
  public isSourceColFirstSubscription = new Subscription();
  private timeSubscription = new Subscription();
  private isPlayingSubscription = new Subscription();

  constructor(
    private readerSpeakerService: ReaderSpeakerService
  ) { }

  ngOnInit(): void {
    this.isTargetDisplayed$ = this.readerSpeakerService.isTargetDisplayed$.pipe(shareReplay(1));
    this.isReadSpeakerActivated$ = this.readerSpeakerService.isReadSpeakerActivated$.pipe(shareReplay(1));
    this.isSourceColFirstSubscription = this.readerSpeakerService.isSourceColFirst$
      .subscribe(value => this.isSourceColFirst = value);
    this.isPlayingSubscription = this.readerSpeakerService.isPlaying$
      .subscribe(value => this.isPlaying = value);
  }

  ngOnDestroy(): void {
    this.timeSubscription.unsubscribe();
    this.isPlayingSubscription.unsubscribe();
    this.isSourceColFirstSubscription.unsubscribe();
  }

  public onInterChange(): void {
    this.readerSpeakerService.toggleIsSourceColFirst$();
  }

  public onNext(): void {
    if (this.isPlaying || [0, 1].includes(this.items.length)) {
      return;
    }
    this.next();
  }

  private next(): void {
    if (!this.currentIndex.showTarget && this.currentIndex.number !== undefined) {
      this.currentIndex.showTarget = true;
      this.readerSpeakerService.textToSpeech(this.items[this.currentIndex.number], this.isSourceColFirst ? 2 : 1);
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
      this.readerSpeakerService.textToSpeech(this.items[number], this.isSourceColFirst ? 1 : 2);
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
      || [0, 1].includes(this.items.length)
      || this.currentIndex.counter === 1
      || this.currentIndex.previousNumber === undefined
    ) {
      return;
    }
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
    if ([0, 1].includes(this.items.length)) {
      return;
    }
    this.readerSpeakerService.setIsPlaying$(true);
    this.timeSubscription = interval(this.time)
      .subscribe(() => this.next());
  }

  public onPause(): void {
    this.readerSpeakerService.setIsPlaying$(false);
    this.timeSubscription.unsubscribe();
  }

  public onReadSpeak(index: number): void {
    this.readerSpeakerService.textToSpeech(this.items[index], 2);
  }

  private getRandomInt(exclusiveMax: number): number {
    return Math.floor(Math.random() * exclusiveMax);
  }
}
