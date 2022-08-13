import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { interval, Subscription } from 'rxjs';
import { Index } from 'src/app/models';
import { Text } from 'src/app/models/text';
import { ExcelService } from 'src/app/services/excel.service';
import { GlobalService } from 'src/app/services/global.service';
import { NavigationService } from 'src/app/services/navigation.service';
// import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';
import { GrammarService } from 'src/app/services/grammar.service';
import { Grammar } from 'src/app/models/grammar';
import { GrammarName } from 'src/app/models/grammar-name';

@Component({
  selector: 'app-interactive-table',
  templateUrl: './interactive-table.component.html'
})
export class InteractiveTableComponent implements OnInit, OnDestroy {

  @Input() set service(service: GrammarService) {
    this._service = service;
    this.serviceUpdate();
  }

  private _service!: GrammarService;

  public name!: string;
  public data!: Array<any>;
  public priority: number | undefined;
  public isValidData!: boolean;
  public firstNext!: boolean;
  public index!: Index;
  public item: any | undefined;

  private excelAdverbsSubscription = new Subscription();
  private excelVerbsSubscription = new Subscription();
  private excelNounsSubscription = new Subscription();
  private excelAdjectivesSubscription = new Subscription();
  private excelConjunctionsSubscription = new Subscription();
  private excelPhrasesSubscription = new Subscription();

  public priorities: Array<number> = [];
  public times: Array<number>;
  private timeSubscription = new Subscription();

  public isPlaying = false;
  public audioUrl: undefined | string;
  public openReadSpeaker = false;
  public canReadSpeak = false;
  public isPrevious = false;
  public isLoaded = false;
  public time: number;

  constructor(
    private excelService: ExcelService,
    private navigationService: NavigationService,
    // private readerSpeakerService: ReaderSpeakerService,
    private messageService: MessageService,
    private globalService: GlobalService
  ) {
    this.times = [3000, 5000, 10000];
    this.time = 3000;
    this.priorities = this.excelService.priorities;
    this.excelService.priorities$.subscribe((priorities) =>
      this.priorities = priorities
    );
  }

  ngOnInit(): void {
    this.excelSubscribe();
  }

  ngOnDestroy(): void {
    this.excelUnsubscribe();
  }

  private excelUnsubscribe(): void {
    switch (this.name) {
      case GrammarName.ADVERBS:
        this.excelAdverbsSubscription.unsubscribe();
        break;
      case GrammarName.VERBS:
        this.excelVerbsSubscription.unsubscribe();
        break;
      case GrammarName.NOUNS:
        this.excelNounsSubscription.unsubscribe();
        break;
      case GrammarName.ADJECTIVES:
        this.excelAdjectivesSubscription.unsubscribe();
        break;
      case GrammarName.CONJUNCTIONS:
        this.excelConjunctionsSubscription.unsubscribe();
        break;
      case GrammarName.PHRASES:
        this.excelPhrasesSubscription.unsubscribe();
        break;
      default:
        break;
    }
  }

  private excelSubscribe(): void {
    switch (this.name) {
      case GrammarName.ADVERBS:
        this.excelAdverbsSubscription = this.excelService.uploadedAdverbs$.subscribe((data) =>
          this.setAndCheckData(data)
        );
        break;
      case GrammarName.VERBS:
        this.excelVerbsSubscription = this.excelService.uploadedVerbs$.subscribe((data) =>
          this.setAndCheckData(data)
        );
        break;
      case GrammarName.NOUNS:
        this.excelNounsSubscription = this.excelService.uploadedNouns$.subscribe((data) =>
          this.setAndCheckData(data)
        );
        break;
      case GrammarName.ADJECTIVES:
        this.excelAdjectivesSubscription = this.excelService.uploadedAdjectives$.subscribe((data) =>
          this.setAndCheckData(data)
        );
        break;
      case GrammarName.CONJUNCTIONS:
        this.excelConjunctionsSubscription = this.excelService.uploadedConjunctions$.subscribe((data) =>
          this.setAndCheckData(data)
        );
        break;
      case GrammarName.PHRASES:
        this.excelPhrasesSubscription = this.excelService.uploadedPhrases$.subscribe((data) =>
          this.setAndCheckData(data)
        );
        break;
      default:
        break;
    }
  }

  private setAndCheckData(data: Array<Grammar>): void {
    this._service.setData(data.filter((item) => item?.show !== '-'));
    this.serviceUpdate();
    this.checkData(this._service.data);
  }

  private serviceUpdate(): void {
    this.name = this._service.name;
    this.data = this._service.data;
    this.priority = this._service.priority;
    this.isValidData = this._service.isValidData;
    this.firstNext = this._service.firstNext;
    this.index = this._service.index;
    this.setItem(this._service.currentItem);
    this.navigationService.setTabIndex(this._service.tabIndex);
  }

  private setItem(item: any) {
    this.isLoaded = false;
    this.item = item;
    this.canReadSpeak = false;
    // if (!!item) {
    //   this.loadAudioUrl(item.danish);
    // }
  }

  private checkData(adverbs: Array<Grammar>): void {
    if (adverbs.length < 2) {
      this._service.setIsValidData(false);
      this.serviceUpdate();
      this.messageService.add({ severity: 'error', summary: Text.notEnoughText, detail: Text.addMoreDataText });
      return;
    }
    const keys = Object.keys(adverbs[0]);
    keys.forEach((key) => {
      if (!this._service.validKeys.includes(key)) {
        this._service.setIsValidData(false);
        this.serviceUpdate();
      }
    });
    const message = (this._service.isValidData) ?
      { severity: 'info', summary: Text.validAdverbsText, detail: Text.selectPriorityText }
      : { severity: 'error', summary: Text.invalidText, detail: Text.removeText };
    this.messageService.add(message);
  }

  public onUploadData(file: File): void {
    this.excelService.excelToJSON(this.name, file);
  }

  public onReload(): void {
    this._service.initVariables();
    this.serviceUpdate();
    this.messageService.add({
      severity: 'warn',
      summary: `${this._service.name.charAt(0).toUpperCase()}${this._service.name.slice(1)} éffacés.`
    });
  }

  public onChangePriority(priority: string): void {
    this._service.setCounter(0);
    this._service.setFirstNext(true);
    if (priority === '0') {
      this._service.setPriority(undefined);
      this._service.setCurrentItem(undefined);
    } else {
      this._service.setPriority(+priority);
      this.selectAdverbs();
      this._service.setIndex({
        previous: undefined,
        current: this._service.index.current,
        next: undefined
      });
    }
    this.serviceUpdate();
  }
  private selectAdverbs(): void {
    if (this._service.priority !== undefined) {
      this._service.setCurrentItem(undefined);
      const priority = +this._service.priority;
      const selectedData = (this._service.data).filter((adverb) =>
        +adverb.priority === priority
      );
      this._service.setSelectedData(selectedData);
      this.onNext();
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

    if (this._service.selectedData.length > 1) {
      this._service.setFirstNext(!this._service.firstNext)
      if (!this._service.firstNext) {
        const index: Index = {
          previous: this._service.index.current,
          current: undefined,
          next: undefined
        };
        if (this._service.index.next !== undefined) {
          index.current = this._service.index.next;
        } else {
          index.current = this.globalService.getNext(this._service.selectedData.length);
        }
        this._service.setIndex(index);
        this.selectCurrentItem();
      } else {
        this._service.setCounter(this._service.counter + 1);
      }
      this.serviceUpdate();
    }

    // setTimeout(() => {
    //   if (this.canReadSpeak) {
    //     this.onReadSpeak();
    //   }
    // }, 100);
  }

  public onPrevious(): void {
    this.isPrevious = true;

    if (this._service.index.previous !== undefined) {
      if (this._service.firstNext) {
        this._service.setCounter(this._service.counter - 1);
      } else {
        this._service.setFirstNext(true);
      }
      const index: Index = {
        previous: undefined,
        current: this._service.index.previous,
        next: this._service.index.current
      };
      this._service.setIndex(index);
      this.selectCurrentItem();
    }
    this.serviceUpdate();
  }

  private selectCurrentItem(): void {
    const currentIndex = this._service.index.current;
    if (currentIndex !== undefined) {
      this._service.setCurrentItem(this._service.selectedData[currentIndex]);
      this.serviceUpdate();
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

  // private loadAudioUrl(word: string): void {
  //   this.readerSpeakerService.getVoice(word).subscribe((audioFile) => {
  //     this.isLoaded = true;
  //     this.audioUrl = this.readerSpeakerService.getUrl(audioFile);
  //     if (this.isPrevious) {
  //       this.onReadSpeak();
  //     }
  //   });
  // }

  public onReadSpeak(): void {
  //   this.openReadSpeaker = false;
  //   setTimeout(() => {
  //     this.openReadSpeaker = true;
  //   }, 100);
  }

}
