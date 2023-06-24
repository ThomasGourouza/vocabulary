import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription, interval } from 'rxjs';
import { Index } from 'src/app/models';
import { Item } from 'src/app/models/item';
import { ExcelService } from 'src/app/services/excel.service';
import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';
import { WordService } from 'src/app/services/word.service';
import { Text } from 'src/app/models/text';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html'
})
export class WordComponent implements OnInit, OnDestroy {
  public data: Array<Item>;
  public priority: number | undefined;
  public isValidData!: boolean;
  public firstNext!: boolean;
  public index: Index;
  public currentItem: Item | undefined;
  private _selectedData!: Array<Item>;

  private excelSubscription = new Subscription();

  public priorities: Array<number> = [];
  public times: Array<number>;
  private timeSubscription = new Subscription();

  public counter = 0;
  public isPlaying = false;
  public audioUrl: undefined | string;
  public openReadSpeaker = false;
  public canReadSpeak = false;
  public isPrevious = false;
  public isLoaded = false;
  public isRemoving = false;
  public time: number;

  constructor(
    private excelService: ExcelService,
    private readerSpeakerService: ReaderSpeakerService,
    private messageService: MessageService,
    public wordService: WordService
  ) {
    this.data = [];
    this.index = {
      previous: undefined,
      current: undefined,
      next: undefined
    };
    this.times = [3000, 5000, 10000];
    this.time = 3000;
  }

  ngOnInit(): void {
    this.excelSubscription = this.excelService.uploadedWords$.subscribe((data) =>
      this.wordService.setData$(data)
    );

    this.excelService.priorities$.subscribe((priorities) =>
      this.priorities = priorities
    );
    this.wordService.data$.subscribe((data) => {
      this.data = data;
      if (this.isRemoving) {
        return;
      }
      this.wordService.setIsValidData$(true);
      if (this.data.length < 2) {
        this.wordService.setIsValidData$(false);
        this.messageService.add({ severity: 'error', summary: Text.notEnoughText, detail: Text.addMoreDataText });
        return;
      }
      const keys = Object.keys(this.data[0]);
      keys.forEach((key) => {
        if (!this.wordService.validKeys.includes(key)) {
          this.wordService.setIsValidData$(false);
        }
      });
    });
    this.wordService.priority$.subscribe((priority) => {
      this.priority = priority;
      if (this.isRemoving) {
        return;
      }
      if (this.priority !== undefined) {
        this.wordService.setCurrentItem$(undefined);
        const selectedData = (this.data).filter((item) =>
          +item.priority === this.priority
        );
        this.wordService.setSelectedData$(selectedData);
        this.next();
      }
    });
    this.wordService.isValidData$.subscribe((isValidData) => {
      this.isValidData = isValidData;
      if (this.isRemoving) {
        return;
      }
      const message = (this.isValidData) ?
        { severity: 'info', summary: Text.validText, detail: Text.selectPriorityText }
        : { severity: 'error', summary: Text.invalidText, detail: Text.removeText };
      this.messageService.add(message);
    });
    this.wordService.firstNext$.subscribe((firstNext) => this.firstNext = firstNext);
    this.wordService.index$.subscribe((index) => this.index = index);
    this.wordService.selectedData$.subscribe((selectedData) => this._selectedData = selectedData);
    this.wordService.currentItem$.subscribe((currentItem) => {
      this.isLoaded = false;
      this.currentItem = currentItem;
      this.canReadSpeak = false;
      // if (!!currentItem) {
      //   this.loadAudioUrl(currentItem.word);
      // }
    });
  }

  ngOnDestroy(): void {
    this.excelSubscription.unsubscribe();
    this.timeSubscription.unsubscribe();
  }

  public onUploadData(file: File): void {
    this.isRemoving = false;
    this.excelService.excelToJSON(file);
  }

  public onReload(): void {
    this.isRemoving = true;
    this.counter = 0;
    this.wordService.initVariables();

    this.messageService.add({
      severity: 'warn',
      summary: `Mots éffacés.`
    });
  }

  public onChangePriority(priority: string): void {
    this.counter = 0;
    this.wordService.setFirstNext$(true);
    if (priority === '0') {
      this.wordService.setPriority$(undefined);
      this.wordService.setCurrentItem$(undefined);
    } else {
      this.wordService.setPriority$(+priority);
      this.wordService.setIndex$({
        previous: undefined,
        current: this.index.current,
        next: undefined
      });
    }
  }

  public onChangeTime(): void {
    if (this.isPlaying) {
      this.timeSubscription.unsubscribe();
      this.onPlay();
    }
  }

  action(action: string): void {
    action === 'next' ?this.onNext() : this.onPrevious();
  }

  public onNext(): void {
    if(!this.currentItem) {
      return;
    }
    this.next();
  }

  private next(): void {
    this.canReadSpeak = true;
    this.isPrevious = false;
    if (this._selectedData.length > 1) {
      this.wordService.setFirstNext$(!this.firstNext)
      if (!this.firstNext) {
        const index: Index = {
          previous: this.index.current,
          current: undefined,
          next: undefined
        };
        if (this.index.next !== undefined) {
          index.current = this.index.next;
        } else {
          index.current = this.wordService.getNext(this._selectedData.length);
        }
        this.wordService.setIndex$(index);
        this.selectCurrentItem();
      } else {
        this.counter++;
      }

    }

    setTimeout(() => {
      if (this.canReadSpeak) {
        this.onReadSpeak();
      }
    }, 100);
  }

  public onPrevious(): void {
    if (this.index.previous === undefined || !this.currentItem) {
      return;
    }
    this.isPrevious = true;
    if (this.firstNext) {
      this.counter--;
    } else {
      this.wordService.setFirstNext$(true);
    }
    const index: Index = {
      previous: undefined,
      current: this.index.previous,
      next: this.index.current
    };
    this.wordService.setIndex$(index);
    this.selectCurrentItem();
  }

  private selectCurrentItem(): void {
    const currentIndex = this.index.current;
    if (currentIndex !== undefined) {
      this.wordService.setCurrentItem$(this._selectedData[currentIndex]);
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

  private loadAudioUrl(word: string): void {
    this.readerSpeakerService.getVoice(word).subscribe((audioFile) => {
      this.isLoaded = true;
      // this.audioUrl = this.readerSpeakerService.getUrl(audioFile);
      this.audioUrl = audioFile.URL;
      if (this.isPrevious) {
        this.onReadSpeak();
      }
    });
  }

  public onReadSpeak(): void {
    this.openReadSpeaker = false;
    setTimeout(() => {
      this.openReadSpeaker = true;
    }, 100);
  }

}

