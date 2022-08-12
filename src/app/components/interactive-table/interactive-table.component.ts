import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { interval, Subscription } from 'rxjs';
import { Index } from 'src/app/models';
import { AdjectivesService } from 'src/app/services/adjectives.service';
import { AdverbsService } from 'src/app/services/adverbs.service';
import { ConjunctionsService } from 'src/app/services/conjunctions.service';
import { ExcelService } from 'src/app/services/excel.service';
import { GlobalService } from 'src/app/services/global.service';
import { NounsService } from 'src/app/services/nouns.service';
import { PhrasesService } from 'src/app/services/phrases.service';
import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';
import { VerbsService } from 'src/app/services/verbs.service';
@Component({
  selector: 'app-interactive-table',
  templateUrl: './interactive-table.component.html'
})
export class InteractiveTableComponent {

  @Input() set currentName(name: string) {
    this.name = name;
    switch (name) {
      case this.adverbsService.name:
        this.data = this.adverbsService.data;
        this.priority = this.adverbsService.priority;
        this.isValidData = this.adverbsService.isValidData;
        this.firstNext = this.adverbsService.firstNext;
        this.index = this.adverbsService.index;
        this.setItem(this.adverbsService.currentItem);
        break;
      case this.verbsService.name:
        this.data = this.verbsService.data;
        this.priority = this.verbsService.priority;
        this.isValidData = this.verbsService.isValidData;
        this.firstNext = this.verbsService.firstNext;
        this.index = this.verbsService.index;
        this.setItem(this.verbsService.currentItem);
        break;
      case this.nounsService.name:
        this.data = this.nounsService.data;
        this.priority = this.nounsService.priority;
        this.isValidData = this.nounsService.isValidData;
        this.firstNext = this.nounsService.firstNext;
        this.index = this.nounsService.index;
        this.setItem(this.nounsService.currentItem);
        break;
      case this.adjectivesService.name:
        this.data = this.adjectivesService.data;
        this.priority = this.adjectivesService.priority;
        this.isValidData = this.adjectivesService.isValidData;
        this.firstNext = this.adjectivesService.firstNext;
        this.index = this.adjectivesService.index;
        this.setItem(this.adjectivesService.currentItem);
        break;
      case this.conjunctionsService.name:
        this.data = this.conjunctionsService.data;
        this.priority = this.conjunctionsService.priority;
        this.isValidData = this.conjunctionsService.isValidData;
        this.firstNext = this.conjunctionsService.firstNext;
        this.index = this.conjunctionsService.index;
        this.setItem(this.conjunctionsService.currentItem);
        break;
      case this.phrasesService.name:
        this.data = this.phrasesService.data;
        this.priority = this.phrasesService.priority;
        this.isValidData = this.phrasesService.isValidData;
        this.firstNext = this.phrasesService.firstNext;
        this.index = this.phrasesService.index;
        this.setItem(this.phrasesService.currentItem);
        break;
      default:
        break;
    }
  }
  public name!: string;
  public data!: Array<any>;
  public priority: number | undefined;
  public isValidData!: boolean;
  public firstNext!: boolean;
  public index!: Index;
  public item: any | undefined;

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
    private readerSpeakerService: ReaderSpeakerService,
    private adverbsService: AdverbsService,
    private verbsService: VerbsService,
    private nounsService: NounsService,
    private adjectivesService: AdjectivesService,
    private conjunctionsService: ConjunctionsService,
    private phrasesService: PhrasesService,
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

  private setItem(item: any) {
    this.isLoaded = false;
    this.item = item;
    this.canReadSpeak = false;
    if (!!item) {
      this.loadAudioUrl(item.danish);
    }
  }

  public onUploadData(file: File): void {
    this.excelService.excelToJSON(this.name, file);
  }

  public onReload(): void {
    // todo: switch
    this.adverbsService.initAdverbsVariables();
    this.messageService.add({
      severity: 'warn',
      summary: `${this.adverbsService.name.charAt(0).toUpperCase()}${this.adverbsService.name.slice(1)} éffacés.`
    });
  }

  // todo: switch
  public onChangePriority(priority: string): void {
    this.adverbsService.setCounter(0);
    this.adverbsService.setFirstNext(true);
    if (priority === '0') {
      this.adverbsService.setPriority(undefined);
      this.adverbsService.setCurrentItem(undefined);
    } else {
      this.adverbsService.setPriority(+priority);
      this.selectAdverbs();
      this.adverbsService.setIndex({
        previous: undefined,
        current: this.adverbsService.index.current,
        next: undefined
      });
    }
  }
  private selectAdverbs(): void {
    if (this.adverbsService.priority !== undefined) {
      this.adverbsService.setCurrentItem(undefined);
      const priority = +this.adverbsService.priority;
      const selectedData = this.adverbsService.data.filter((adverb) =>
        +adverb.priority === priority
      );
      this.adverbsService.setSelectedData(selectedData);
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

    // todo: switch
    if (this.adverbsService.selectedData.length > 1) {
      this.adverbsService.setFirstNext(!this.adverbsService.firstNext)
      if (!this.adverbsService.firstNext) {
        const index: Index = {
          previous: this.adverbsService.index.current,
          current: undefined,
          next: undefined
        };
        if (this.adverbsService.index.next !== undefined) {
          index.current = this.adverbsService.index.next;
        } else {
          index.current = this.globalService.getNext(this.adverbsService.selectedData.length);
        }
        this.adverbsService.setIndex(index);
        this.selectCurrentItem();
      } else {
        this.adverbsService.setCounter(this.adverbsService.counter + 1);
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

    // todo: switch
    if (this.adverbsService.index.previous !== undefined) {
      if (this.adverbsService.firstNext) {
        this.adverbsService.setCounter(this.adverbsService.counter - 1);
      } else {
        this.adverbsService.setFirstNext(true);
      }
      const index: Index = {
        previous: undefined,
        current: this.adverbsService.index.previous,
        next: this.adverbsService.index.current
      };
      this.adverbsService.setIndex(index);
      this.selectCurrentItem();
    }
  }



  private selectCurrentItem(): void {
    const currentIndex = this.adverbsService.index.current;
    if (currentIndex !== undefined) {
      this.adverbsService.setCurrentItem(this.adverbsService.selectedData[currentIndex]);
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
      this.audioUrl = this.readerSpeakerService.getUrl(audioFile);
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
