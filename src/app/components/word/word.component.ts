import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription, interval } from 'rxjs';
import { Index } from 'src/app/models';
import { Item } from 'src/app/models/item';
import { ExcelService } from 'src/app/services/excel.service';
import { Text } from 'src/app/models/text';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html'
})
export class WordComponent implements OnInit, OnDestroy {
  public data: Item[] = [];
  public priority: number | undefined;
  public time = 3000;

  public counter = 0;
  public isPlaying = false;
  public isPrevious = false;

  public times = [3000, 5000, 10000];
  public priorities: number[] = [];

  public isValidData = true;
  private validKeys = [
    "french",
    "word",
    "gender",
    "priority"
  ];
  public firstNext = true;
  public index: Index = {
    previous: undefined,
    current: undefined,
    next: undefined
  };
  public currentItem: Item | undefined;

  private memory: Array<number> = [];
  private lastInMemory: number | undefined;

  private excelSubscription = new Subscription();
  private timeSubscription = new Subscription();


  constructor(
    private excelService: ExcelService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.excelSubscription = this.excelService.uploadedWords$.subscribe((data) => {
      const isEnoughData = data.length >= 2;
      const areValidKeys = !Object.keys(data[0]).some((key) => !this.validKeys.includes(key));
      this.isValidData = isEnoughData && areValidKeys;
      if (this.isValidData) {
        this.data = data;
        this.data.map((item) => item?.priority)?.forEach((priority: number) => {
          if (!this.priorities.includes(priority)) {
            this.priorities.push(priority);
          }
        });
      }
      let message = { severity: 'info', summary: Text.validText, detail: Text.selectPriorityText };
      if (!areValidKeys) {
        message = { severity: 'error', summary: Text.invalidText, detail: Text.removeText };
      }
      if (!isEnoughData) {
        message = { severity: 'error', summary: Text.notEnoughText, detail: Text.addMoreDataText };
      }
      this.messageService.add(message);
    });
  }

  ngOnDestroy(): void {
    this.excelSubscription.unsubscribe();
    this.timeSubscription.unsubscribe();
  }

  public onUploadData(file: File): void {
    this.excelService.excelToJSON(file);
  }

  public onReload(): void {
    this.isValidData = true;
    this.counter = 0;
    this.data = [];
    this.priority = undefined;
    this.priorities = [];
    this.currentItem = undefined;
    this.index = { previous: undefined, current: undefined, next: undefined };
    this.firstNext = true;

    this.messageService.add({
      severity: 'warn',
      summary: `Mots éffacés.`
    });
  }

  public onChangePriority(priority: number): void {
    this.counter = 0;
    this.priority = +priority;
    this.firstNext = true;
    this.currentItem = undefined;
    this.index = {
      previous: undefined,
      current: this.index.current,
      next: undefined
    };
    this.next();
  }

  public onChangeTime(): void {
    if (this.isPlaying) {
      this.timeSubscription.unsubscribe();
      this.onPlay();
    }
  }

  action(action: string): void {
    action === 'next' ? this.onNext() : this.onPrevious();
  }

  public onNext(): void {
    if (!this.currentItem) {
      return;
    }
    this.next();
  }

  private next(): void {
    this.isPrevious = false;
    this.firstNext = !this.firstNext;
    if (!this.firstNext) {
      const index: Index = {
        previous: this.index.current,
        current: undefined,
        next: undefined
      };
      if (this.index.next !== undefined) {
        index.current = this.index.next;
      } else {
        index.current = this.getNext(this.data, this.priority);
      }
      this.index = index;
      this.selectCurrentItem();
    } else {
      this.counter++;
    }

  }

  public onPrevious(): void {
    if (this.index.previous === undefined || !this.currentItem) {
      return;
    }
    this.isPrevious = true;
    if (this.firstNext) {
      this.counter--;
    } else {
      this.firstNext = true;
    }
    const index: Index = {
      previous: undefined,
      current: this.index.previous,
      next: this.index.current
    };
    this.index = index;
    this.selectCurrentItem();
  }

  private selectCurrentItem(): void {
    const currentIndex = this.index.current;
    if (currentIndex !== undefined) {
      this.currentItem = this.data.filter(item => item.priority === this.priority)[currentIndex];
    }
  }

  public onPlay(): void {
    if (!this.currentItem) {
      return;
    }
    this.isPlaying = true;
    this.timeSubscription = interval(this.time).subscribe(() =>
      this.next()
    );
  }
  public onStop(): void {
    this.isPlaying = false;
    this.timeSubscription.unsubscribe();
  }

  public onReadSpeak(): void {

  }

  public getNext(data: Item[], priority: number | undefined): number {
    const length = data.filter(item => item.priority === priority).length;
    if (length <= 0) {
      return 0;
    }
    this.lastInMemory = undefined;
    if (this.memory.length === length) {
      this.lastInMemory = this.memory.pop();
      this.memory = [];
    }
    let array: Array<number> = [];
    for (let i = 0; i < length; i++) {
      array.push(i);
    }
    const leftIndexes = array.filter((index) => !this.memory.includes(index));
    let randomIndex = 0;
    do {
      randomIndex = leftIndexes[this.getRandomInt(leftIndexes.length)];
    } while (randomIndex === this.lastInMemory);
    this.memory.push(randomIndex);
    return randomIndex;
  }

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

}

