import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription, filter, interval, shareReplay, tap } from 'rxjs';
import { Index } from 'src/app/models/index';
import { Item } from 'src/app/models/item';
import { Time, TimeLabel, TimeValue, timeBetween } from 'src/app/models/time';
import { ItemsService } from 'src/app/services/items.service';
import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';
import { WakelockService } from 'src/app/services/wakelock.service';

@Component({
  selector: 'app-interactive-table',
  templateUrl: './interactive-table.component.html'
})
export class InteractiveTableComponent implements OnInit, OnDestroy {
  @Output() gameMode = new EventEmitter<boolean>();
  public items: Item[] = [];
  public currentIndex!: Index;
  public isPlaying = false;
  public times: Time[] = [
    { label: TimeLabel.ONE, value: TimeValue.ONE },
    { label: TimeLabel.TWO, value: TimeValue.TWO },
    { label: TimeLabel.THREE, value: TimeValue.THREE }
  ];
  private sourceTime: number = this.times[0].value;
  public time: number;
  private memory: number[] = [];
  public isSourceColFirst!: boolean;
  public isDataEmpty = true;
  public isReadSpeakerActivated!: boolean;
  public progress = 0;
  public isFirstProgress = true;
  private isWakeLockActive = false;
  private timerIdSecondTime: any;
  private timerIdThirdTime: any;

  public isTargetDisplayed$!: Observable<boolean>;
  public isSourceColFirstSubscription = new Subscription();
  private timeSubscription = new Subscription();
  private isPlayingSubscription = new Subscription();
  private isReadSpeakerActivatedSubscription = new Subscription();
  private itemsSubscription = new Subscription();

  constructor(
    private readerSpeakerService: ReaderSpeakerService,
    private wakelockService: WakelockService,
    private itemsService: ItemsService
  ) {
    this.time = +(localStorage.getItem('vocabularyAppTime') ?? this.times[1].value);
  }

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
      this.isDataEmpty = this.items.length === 0;
      this.memory = [];
      this.onPause();
      this.readerSpeakerService.setIsTargetDisplayed$(true);
      this.isFirstProgress = !this.isFirstProgress;
      this.progress = 0;
      setTimeout(() => { this.updateProgress(); }, 10);
    });
    this.isTargetDisplayed$ = this.readerSpeakerService.isTargetDisplayed$.pipe(shareReplay(1));
    this.isReadSpeakerActivatedSubscription = this.readerSpeakerService.isReadSpeakerActivated$
      .subscribe(value => {
        this.isReadSpeakerActivated = value;
        if (!this.isReadSpeakerActivated) {
          this.readerSpeakerService.cancelReadSpeak();
          clearTimeout(this.timerIdSecondTime);
          clearTimeout(this.timerIdThirdTime);
          this.time = this.times[0].value;
        } else {
          this.time = +(localStorage.getItem('vocabularyAppTime') ?? this.times[1].value);
        }
      });
    this.isSourceColFirstSubscription = this.readerSpeakerService.isSourceColFirst$
      .subscribe(value => this.isSourceColFirst = value);
    this.isPlayingSubscription = this.readerSpeakerService.isPlaying$
      .subscribe(value => {
        this.isPlaying = value;
        if (!this.isPlaying) {
          clearTimeout(this.timerIdSecondTime);
          clearTimeout(this.timerIdThirdTime);
        }
      });
  }

  ngOnDestroy(): void {
    this.timeSubscription.unsubscribe();
    this.isPlayingSubscription.unsubscribe();
    this.isSourceColFirstSubscription.unsubscribe();
    this.isReadSpeakerActivatedSubscription.unsubscribe();
    this.itemsSubscription.unsubscribe();
    this.wakelockService.releaseWakeLock().then(_ => this.isWakeLockActive = false);
  }

  public onInterChange(): void {
    this.readerSpeakerService.toggleIsSourceColFirst$();
  }

  public onRefresh(): void {
    this.ngOnInit();
  }

  public onGameMode(): void {
    this.gameMode.emit(true);
  }

  public setLocalStorageTime(time: any): void {
    localStorage.setItem('vocabularyAppTime', time);
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
        const item = this.items[this.currentIndex.number];
        const position = this.isSourceColFirst ? 2 : 1;
        this.readSpeak(item, position);
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
      this.updateProgressNext();
      if (this.isReadSpeakerActivated) {
        const item = this.items[number];
        const position = this.isSourceColFirst ? 1 : 2;
        this.readSpeak(item, position);
      }
    }
    this.readerSpeakerService.setIsTargetDisplayed$(this.currentIndex.showTarget);
  }

  private readSpeak(item: Item, position: 1 | 2): void {
    this.readerSpeakerService.textToSpeech(item, position);
    if (position === 2 && this.isPlaying) {
      const selectedTime = this.times.find(time => +time.value === +this.time)?.label;
      if ([TimeLabel.TWO, TimeLabel.THREE].includes(selectedTime as TimeLabel)) {
        this.timerIdSecondTime = setTimeout(() => {
          this.readerSpeakerService.textToSpeech(item, position);
        }, timeBetween * 1000);
      }
      if (selectedTime === TimeLabel.THREE) {
        this.timerIdThirdTime = setTimeout(() => {
          this.readerSpeakerService.textToSpeech(item, position);
        }, timeBetween * 2000);
      }
    }
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
    this.updateProgress();
  }

  public onPlay(): void {
    if (this.isDataEmpty) return;
    this.wakelockService.requestWakeLock().then(wakelock =>
      this.isWakeLockActive = wakelock
    );
    this.readerSpeakerService.setIsPlaying$(true);
    this.next();
    let timeSec = 0;
    this.timeSubscription = interval(1000)
      .pipe(
        tap(_ => timeSec++),
        filter(_ =>
          this.isSourceColFirst
          && (!this.currentIndex.showTarget && timeSec === this.sourceTime
            || this.currentIndex.showTarget && timeSec === +this.time) ||
          !this.isSourceColFirst
          && (!this.currentIndex.showTarget && timeSec === +this.time
            || this.currentIndex.showTarget && timeSec === this.sourceTime)
        ),
        tap(_ => timeSec = 0)
      ).subscribe(_ => {
        if (this.currentIndex.counter % this.items.length === 0 && this.currentIndex.showTarget) {
          this.onPause();
          this.readerSpeakerService.signalEndOfPlay();
        } else {
          this.next();
        }
      });
  }

  public onPause(): void {
    this.readerSpeakerService.setIsPlaying$(false);
    this.timeSubscription.unsubscribe();
    if (this.isWakeLockActive) {
      this.wakelockService.releaseWakeLock().then(wakelock =>
        this.isWakeLockActive = wakelock
      );
    }
  }

  public onReadSpeak(index: number): void {
    this.readerSpeakerService.textToSpeech(this.items[index], 2);
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
