import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, interval, shareReplay } from 'rxjs';
import { Item } from 'src/app/models/item';
import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';
export interface Index {
  previousNumber: number | undefined;
  nextNumber: number | undefined;
  number: number | undefined;
  showSecondWord: boolean;
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
    if (this.items.length === 0) {
      this.currentIndex = {
        previousNumber: undefined,
        nextNumber: undefined,
        number: undefined,
        showSecondWord: false,
        counter: 0
      };
      this.memory = [];
      this.onPause();
    } else {
      this.next();
    }
  }

  public currentIndex!: Index;
  public isPlaying = false;
  public times = [2000, 3000, 5000, 10000];
  public time = this.times[0];
  private memory: number[] = [];

  public isReadSpeakerActivated$!: Observable<boolean>;
  public isFrenchColFirst$!: Observable<boolean>;

  private timeSubscription = new Subscription();
  private isPlayingSubscription = new Subscription();

  constructor(
    private readerSpeakerService: ReaderSpeakerService
  ) { }

  ngOnInit(): void {
    this.isReadSpeakerActivated$ = this.readerSpeakerService.isReadSpeakerActivated$;
    this.isFrenchColFirst$ = this.readerSpeakerService.isFrenchColFirst$;
    this.isPlayingSubscription = this.readerSpeakerService.isPlaying$
      .subscribe(value => this.isPlaying = value);
  }

  ngOnDestroy(): void {
    this.timeSubscription.unsubscribe();
    this.isPlayingSubscription.unsubscribe();
  }

  public onNext(): void {
    if (this.isPlaying || this.items.length === 0) {
      return;
    }
    this.next();
  }

  private next(): void {
    if (!this.currentIndex.showSecondWord && this.currentIndex.number !== undefined) {
      this.currentIndex.showSecondWord = true;
      this.textToSpeach(2, this.items[this.currentIndex.number]);
    } else {
      const previousNumber = this.currentIndex.number;
      const number = this.currentIndex.nextNumber ?? this.getRandomIndex();
      this.currentIndex = {
        previousNumber,
        nextNumber: undefined,
        number,
        showSecondWord: false,
        counter: this.currentIndex.counter + 1
      };
      this.textToSpeach(1, this.items[number]);
    }
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
      || this.items.length === 0
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
      showSecondWord: true,
      counter: this.currentIndex.counter - 1
    };
  }

  public onPlay(): void {
    if (this.items.length === 0) {
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

  public onReadSpeak(): void {
    if (this.isPlaying
      || this.items.length === 0
      || !this.currentIndex.number
      || !this.currentIndex.showSecondWord
    ) {
      return;
    }
    this.textToSpeach(2, this.items[this.currentIndex.number]);
  }

  private getRandomInt(exclusiveMax: number): number {
    return Math.floor(Math.random() * exclusiveMax);
  }

  private textToSpeach(position: number, item: Item): void {
    this.readerSpeakerService.textToSpeach(position, item);
  }
}
