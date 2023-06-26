import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';
import { Item } from 'src/app/models/item';
import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';
export interface Index {
  previousNumber: number | undefined;
  nextNumber: number | undefined;
  number: number | undefined;
  showTranslation: boolean;
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
        showTranslation: false,
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
  public isSoundActivated!: boolean;

  private isSoundActivatedSubscription = new Subscription();
  private timeSubscription = new Subscription();

  constructor(private readerSpeakerService: ReaderSpeakerService) { }

  ngOnInit(): void {
    this.isSoundActivatedSubscription = this.readerSpeakerService.isReadSpeakerActivated$
      .subscribe(activated => this.isSoundActivated = activated);
  }

  ngOnDestroy(): void {
    this.timeSubscription.unsubscribe();
    this.isSoundActivatedSubscription.unsubscribe();
  }

  public onNext(): void {
    if (this.isPlaying || this.items.length === 0) {
      return;
    }
    this.next();
  }

  private next(): void {
    if (!this.currentIndex.showTranslation && !!this.currentIndex.number) {
      this.currentIndex.showTranslation = true;
      this.textToSpeach('ru', this.items[this.currentIndex.number].word);
    } else {
      const previousNumber = this.currentIndex.number;
      const number = this.currentIndex.nextNumber ?? this.getRandomIndex();
      this.currentIndex = {
        previousNumber,
        nextNumber: undefined,
        number,
        showTranslation: false,
        counter: this.currentIndex.counter + 1
      };
      this.textToSpeach('fr', this.items[number].french);
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
      showTranslation: true,
      counter: this.currentIndex.counter - 1
    };
  }

  public onPlay(): void {
    if (this.items.length === 0) {
      return;
    }
    this.isPlaying = true;
    this.timeSubscription = interval(this.time)
      .subscribe(() => this.next());
  }

  public onPause(): void {
    this.isPlaying = false;
    this.timeSubscription.unsubscribe();
  }

  public onReadSpeak(): void {
    if (this.isPlaying
      || this.items.length === 0
      || !this.currentIndex.number
      || !this.currentIndex.showTranslation
    ) {
      return;
    }
    this.textToSpeach('ru', this.items[this.currentIndex.number].word);
  }

  private getRandomInt(exclusiveMax: number): number {
    return Math.floor(Math.random() * exclusiveMax);
  }

  private textToSpeach(lang: string, text: string): void {
    if(this.isSoundActivated) {
      console.log('Text to speach: ' + lang + ', ' + text);
    }
  }
}
