import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { Item } from 'src/app/models/item';
export interface Index {
  previousNumber: number | undefined;
  nextNumber: number | undefined;
  number: number;
  showTranslation: boolean;
  counter: number;
}


@Component({
  selector: 'app-interactive-table',
  templateUrl: './interactive-table.component.html'
})
export class InteractiveTableComponent implements OnDestroy {
  public _items!: Item[];
  get items(): Item[] {
    return this._items;
  }
  @Input() set items(values: Item[]) {
    this._items = values;
    if (this._items.length === 0) {
      this.currentIndex = {
        previousNumber: undefined,
        nextNumber: undefined,
        number: 0,
        showTranslation: false,
        counter: 1
      };
      this.onPause();
    }
  }

  public currentIndex: Index = {
    previousNumber: undefined,
    nextNumber: undefined,
    number: 0,
    showTranslation: false,
    counter: 1
  };
  public isPlaying = false;
  public time = 3000;
  public times = [3000, 5000, 10000];

  private timeSubscription = new Subscription();

  constructor() { }

  ngOnDestroy(): void {
    this.timeSubscription.unsubscribe();
  }

  public onNext(): void {
    if (this.isPlaying || this.items.length === 0) {
      return;
    }
    this.next();
  }

  private next(): void {
    if (!this.currentIndex.showTranslation) {
      this.currentIndex.showTranslation = true;
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
    }
  }

  public getRandomIndex(): number {
    return this.getRandomInt(this.items.length);
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
    this.timeSubscription = interval(this.time).subscribe(() =>
      this.next()
    );
  }

  public onPause(): void {
    this.isPlaying = false;
    this.timeSubscription.unsubscribe();
  }

  public onReadSpeak(): void {
    if (this.isPlaying || this.items.length === 0) {
      return;
    }
  }

  private getRandomInt(exclusiveMax: number): number {
    return Math.floor(Math.random() * exclusiveMax);
  }
}
