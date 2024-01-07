import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subscription, filter, interval, shareReplay, tap } from 'rxjs';
import { Index } from 'src/app/models/index';
import { Item } from 'src/app/models/item';
import { GameService } from 'src/app/services/game.service';
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
  public isPlaying = true;

  public isSourceColFirstSubscription = new Subscription();
  private itemsSubscription = new Subscription();
  private timeSubscription = new Subscription();

  constructor(
    private itemsService: ItemsService,
    private readerSpeakerService: ReaderSpeakerService,
    private gameService: GameService
  ) { }

  ngOnInit(): void {
    this.itemsSubscription = this.itemsService.items$.subscribe(items => {
      this.items = items;
      this.isEnoughData = this.items.length >= 3;
      this.onRefresh();
    });
    this.isSourceColFirstSubscription = this.readerSpeakerService.isSourceColFirst$
      .subscribe(value => this.isSourceColFirst = value);
    this.gameService.success$.subscribe(success => {
      if (success) {
        this.currentIndex.counter++;
        if (this.currentIndex.counter === this.items.length) {
          console.log('gongrats!');
          this.updateProgressNext();
          this.gameService.setIsPlaying$(false);
        } else {
          this.updateProgressNext();
          setTimeout(() => this.next(), 500);
        }
      }
    });
    this.gameService.isPlaying$.subscribe(isPlaying => this.isPlaying = isPlaying);
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
    this.gameService.setIsPlaying$(false);
    this.gameService.setSuccess$(false);
    this.currentIndex = {
      previousNumber: undefined,
      nextNumber: undefined,
      number: undefined,
      showTarget: false,
      counter: 0
    };
    this.memory = [];
    this.isFirstProgress = !this.isFirstProgress;
    this.progress = 0;
    setTimeout(() => { this.updateProgress(); }, 10);
  }

  public onNoGameMode(): void {
    this.onRefresh();
    this.gameMode.emit(false);
  }

  public onPlay(): void {
    this.onRefresh();
    setTimeout(() => {
      if (this.isEnoughData) {
        this.gameService.setIsPlaying$(true);
        this.next();
        this.updateProgressNext();
      }
    });
  }

  private next(): void {
    if (!this.isEnoughData) return;
    const number = this.currentIndex.nextNumber ?? this.getRandomIndex();
    this.currentIndex.number = number;
    this.currentIndex.showTarget = true;
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
