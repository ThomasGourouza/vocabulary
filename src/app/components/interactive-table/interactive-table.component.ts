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
      this.onPause();
    }
  }

  public counter = 0;
  public currentIndex = 0;
  public isPlaying = false;
  public time = 3000;
  public times = [3000, 5000, 10000];

  private timeSubscription = new Subscription();

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.timeSubscription.unsubscribe();
  }

  public onChangeTime(): void {
    if (this.isPlaying || this.items.length === 0) {
      return;
    }
    this.timeSubscription.unsubscribe();
    this.onPlay();
  }

  public onNext(): void {
    if (this.isPlaying || this.items.length === 0) {
      return;
    }
    this.counter++;
    if (this.currentIndex < this._items.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  public onPrevious(): void {
    if (this.isPlaying || this.items.length === 0 || this.counter === 0) {
      return;
    }
    this.counter--;
    this.currentIndex--;
  }

  public onPlay(): void {
    if (this.items.length === 0) {
      return;
    }
    this.isPlaying = true;
    // this.timeSubscription = interval(this.time).subscribe(() =>
    //   this.onNext()
    // );
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

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }
}
