import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { Item } from 'src/app/models/item';


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
    if (this._items.length === 0) {
      this.counter = 0;
      this.currentIndex = 0;
    }
  }

  public counter = 0;
  public isPlaying = false;
  public time = 3000;
  public currentIndex = 0;
  public times = [3000, 5000, 10000];

  private timeSubscription = new Subscription();

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.timeSubscription.unsubscribe();
  }

  public onChangeTime(): void {
    if (this.isPlaying) {
      this.timeSubscription.unsubscribe();
      this.onPlay();
    }
  }

  public onNext(): void {
    this.counter++;
    if (this.currentIndex < this._items.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    // if (!this.currentItem) {
    //   return;
    // }
    // this.next();
  }

  private next(): void {
    // this.isPrevious = false;
    // this.firstNext = !this.firstNext;
    // if (!this.firstNext) {
    //   const index: Index = {
    //     previous: this.index.current,
    //     current: undefined,
    //     next: undefined
    //   };
    //   if (this.index.next !== undefined) {
    //     index.current = this.index.next;
    //   } else {
    //     index.current = this.getNext(this._items, this.priority);
    //   }
    //   this.index = index;
    //   this.selectCurrentItem();
    // } else {
    //   this.counter++;
    // }
  }

  public onPrevious(): void {
    if (this.currentIndex > 0) {
      this.counter--;
      this.currentIndex--;
    }
    // if (this.index.previous === undefined || !this.currentItem) {
    //   return;
    // }
    // this.isPrevious = true;
    // if (this.firstNext) {
    //   this.counter--;
    // } else {
    //   this.firstNext = true;
    // }
    // const index: Index = {
    //   previous: undefined,
    //   current: this.index.previous,
    //   next: this.index.current
    // };
    // this.index = index;
    // this.selectCurrentItem();
  }

  private selectCurrentItem(): void {
    // const currentIndex = this.index.current;
    // if (currentIndex !== undefined) {
    //   this.currentItem = this._items.filter(item => item.priority === this.priority)[currentIndex];
    // }
  }

  public onPlay(): void {
    // if (!this.currentItem) {
    //   return;
    // }
    // this.isPlaying = true;
    // this.timeSubscription = interval(this.time).subscribe(() =>
    //   this.next()
    // );
  }
  public onPause(): void {
    this.isPlaying = false;
    this.timeSubscription.unsubscribe();
  }

  public onReadSpeak(): void {
  }

  public getNext(data: Item[], priority: number | undefined): number {
    // const length = data.filter(item => item.priority === priority).length;
    // if (length <= 0) {
    //   return 0;
    // }
    // this.lastInMemory = undefined;
    // if (this.memory.length === length) {
    //   this.lastInMemory = this.memory.pop();
    //   this.memory = [];
    // }
    // let array: number[] = [];
    // for (let i = 0; i < length; i++) {
    //   array.push(i);
    // }
    // const leftIndexes = array.filter((index) => !this.memory.includes(index));
    // let randomIndex = 0;
    // do {
    //   randomIndex = leftIndexes[this.getRandomInt(leftIndexes.length)];
    // } while (randomIndex === this.lastInMemory);
    // this.memory.push(randomIndex);
    // return randomIndex;
    return 0;
  }

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }
}
