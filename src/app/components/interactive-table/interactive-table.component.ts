import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { interval, Subscription } from 'rxjs';
import { Index } from 'src/app/models';
import { Text } from 'src/app/models/text';
import { ExcelService } from 'src/app/services/excel.service';
import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';
import { ItemService } from 'src/app/services/item.service';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-interactive-table',
  templateUrl: './interactive-table.component.html'
})
export class InteractiveTableComponent implements OnInit, OnDestroy {

  @Input() service!: ItemService;

  public name!: string;
  public data: Array<Item>;
  public priority: number | undefined;
  public isValidData!: boolean;
  public firstNext!: boolean;
  public index: Index;
  public currentItem: Item | undefined;
  private _selectedData!: Array<Item>;
  private _counter!: number;

  private excelSubscription = new Subscription();

  public priorities: Array<number> = [];
  public times: Array<number>;
  private timeSubscription = new Subscription();

  public isPlaying = false;
  public audioUrl: undefined | string;
  public openReadSpeaker = false;
  public canReadSpeak = false;
  public isPrevious = false;
  // TODO: set to false
  public isLoaded = false;
  public time: number;

  constructor(
    private excelService: ExcelService,
    private readerSpeakerService: ReaderSpeakerService,
    private messageService: MessageService
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
    this.name = this.service.name;

    this.excelSubscription = this.excelService.uploadedAdjectives$.subscribe((data) =>
      this.service.setData$(data)
    );

    this.excelService.priorities$.subscribe((priorities) =>
      this.priorities = priorities
    );
    this.service.data$.subscribe((data) => {
      this.data = data.filter((item) => item?.show !== '-');
      this.service.setIsValidData$(true);
      if (this.data.length < 2) {
        this.service.setIsValidData$(false);
        this.messageService.add({ severity: 'error', summary: Text.notEnoughText, detail: Text.addMoreDataText });
        return;
      }
      const keys = Object.keys(this.data[0]);
      keys.forEach((key) => {
        if (!this.service.validKeys.includes(key)) {
          this.service.setIsValidData$(false);
        }
      });
    });
    this.service.priority$.subscribe((priority) => {
      this.priority = priority;
      if (this.priority !== undefined) {
        this.service.setCurrentItem$(undefined);
        const selectedData = (this.data).filter((item) =>
          +item.priority === this.priority
        );
        this.service.setSelectedData$(selectedData);
        this.onNext();
      }
    });
    this.service.isValidData$.subscribe((isValidData) => {
      this.isValidData = isValidData;
      const message = (this.isValidData) ?
        { severity: 'info', summary: Text.validText, detail: Text.selectPriorityText }
        : { severity: 'error', summary: Text.invalidText, detail: Text.removeText };
      this.messageService.add(message);
    });
    this.service.firstNext$.subscribe((firstNext) => this.firstNext = firstNext);
    this.service.index$.subscribe((index) => this.index = index);
    this.service.selectedData$.subscribe((selectedData) => this._selectedData = selectedData);
    this.service.counter$.subscribe((counter) => this._counter = counter);
    this.service.currentItem$.subscribe((currentItem) => {
      this.isLoaded = false;
      this.currentItem = currentItem;
      this.canReadSpeak = false;
      if (!!currentItem) {
        this.loadAudioUrl(currentItem.word);
      }
    });
  }

  ngOnDestroy(): void {
    this.excelSubscription.unsubscribe();
    this.timeSubscription.unsubscribe();
  }

  public onUploadData(file: File): void {
    this.excelService.excelToJSON(this.name, file);
  }

  public onReload(): void {
    this.service.initVariables();

    this.messageService.add({
      severity: 'warn',
      summary: `${this.service.name.charAt(0).toUpperCase()}${this.service.name.slice(1)} éffacés.`
    });
  }

  public onChangePriority(priority: string): void {
    this.service.setCounter$(0);
    this.service.setFirstNext$(true);
    if (priority === '0') {
      this.service.setPriority$(undefined);
      this.service.setCurrentItem$(undefined);
    } else {
      this.service.setPriority$(+priority);
      this.service.setIndex$({
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

  public onNext(): void {
    this.canReadSpeak = true;
    this.isPrevious = false;

    if (this._selectedData.length > 1) {
      this.service.setFirstNext$(!this.firstNext)
      if (!this.firstNext) {
        const index: Index = {
          previous: this.index.current,
          current: undefined,
          next: undefined
        };
        if (this.index.next !== undefined) {
          index.current = this.index.next;
        } else {
          index.current = this.service.getNext(this._selectedData.length);
        }
        this.service.setIndex$(index);
        this.selectCurrentItem();
      } else {
        this.service.setCounter$(this._counter + 1);
      }

    }

    setTimeout(() => {
      if (this.canReadSpeak) {
        this.onReadSpeak();
      }
    }, 100);
  }

  public onPrevious(): void {
    this.isPrevious = true;

    if (this.index.previous !== undefined) {
      if (this.firstNext) {
        this.service.setCounter$(this._counter - 1);
      } else {
        this.service.setFirstNext$(true);
      }
      const index: Index = {
        previous: undefined,
        current: this.index.previous,
        next: this.index.current
      };
      this.service.setIndex$(index);
      this.selectCurrentItem();
    }

  }

  private selectCurrentItem(): void {
    const currentIndex = this.index.current;
    if (currentIndex !== undefined) {
      this.service.setCurrentItem$(this._selectedData[currentIndex]);
    }
  }

  public onPlay(): void {
    this.isPlaying = true;
    this.timeSubscription = interval(this.time).subscribe(() =>
      this.onNext()
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
