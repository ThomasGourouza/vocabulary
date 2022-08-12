import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { interval, Subscription } from 'rxjs';
import { Index } from 'src/app/models';
import { Adverb } from 'src/app/models/adverb';
import { Verb } from 'src/app/models/verb';
import { Text } from 'src/app/models/text';
import { AdjectivesService } from 'src/app/services/adjectives.service';
import { AdverbsService } from 'src/app/services/adverbs.service';
import { ConjunctionsService } from 'src/app/services/conjunctions.service';
import { ExcelService } from 'src/app/services/excel.service';
import { GlobalService } from 'src/app/services/global.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { NounsService } from 'src/app/services/nouns.service';
import { PhrasesService } from 'src/app/services/phrases.service';
import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';
import { VerbsService } from 'src/app/services/verbs.service';
import { Phrase } from 'src/app/models/phrase';
import { Conjunction } from 'src/app/models/conjunction';
import { Adjective } from 'src/app/models/adjective';
import { Noun } from 'src/app/models/noun';

export type GrammaticalType = Adverb | Verb | Noun | Adjective | Conjunction | Phrase;
@Component({
  selector: 'app-interactive-table',
  templateUrl: './interactive-table.component.html'
})
export class InteractiveTableComponent {

  @Input() set service(service: AdverbsService | VerbsService | NounsService | AdjectivesService | ConjunctionsService | PhrasesService) {
    this._service = service;
    this.name = this._service.name;
    this.navigationService.setTabIndex(this._service.tabIndex);
    this.data = this._service.data;
    this.priority = this._service.priority;
    this.isValidData = this._service.isValidData;
    this.firstNext = this._service.firstNext;
    this.index = this._service.index;
    this.setItem(this._service.currentItem);

    this.excelAdverbsSubscription.unsubscribe();
    this.excelVerbsSubscription.unsubscribe();
    this.excelNounsSubscription.unsubscribe();
    this.excelAdjectivesSubscription.unsubscribe();
    this.excelConjunctionsSubscription.unsubscribe();
    this.excelPhrasesSubscription.unsubscribe();

    switch (this.name) {
      case this.adverbsService.name:
        this.excelAdverbsSubscription = this.excelService.uploadedAdverbs$.subscribe((adverbs: Array<Adverb>) => {
          this.adverbsService.setData(adverbs.filter((adverb) => adverb?.show !== '-'));
          this.checkData(this.adverbsService.data);
        });
        break;
      case this.verbsService.name:
        this.excelVerbsSubscription = this.excelService.uploadedVerbs$.subscribe((verbs: Array<Verb>) => {
          this.verbsService.setData(verbs.filter((verb) => verb?.show !== '-'));
          this.checkData(this.verbsService.data);
        });
        break;
        case this.nounsService.name:
        this.excelNounsSubscription = this.excelService.uploadedNouns$.subscribe((nouns: Array<Noun>) => {
          this.nounsService.setData(nouns.filter((noun) => noun?.show !== '-'));
          this.checkData(this.nounsService.data);
        });
        break;
      case this.adjectivesService.name:
        this.excelAdjectivesSubscription = this.excelService.uploadedAdjectives$.subscribe((adjectives: Array<Adjective>) => {
          this.adjectivesService.setData(adjectives.filter((adjective) => adjective?.show !== '-'));
          this.checkData(this.adjectivesService.data);
        });
        break;
      case this.conjunctionsService.name:
        this.excelConjunctionsSubscription = this.excelService.uploadedConjunctions$.subscribe((conjunctions: Array<Conjunction>) => {
          this.conjunctionsService.setData(conjunctions.filter((conjunction) => conjunction?.show !== '-'));
          this.checkData(this.conjunctionsService.data);
        });
        break;
      case this.phrasesService.name:
        this.excelPhrasesSubscription = this.excelService.uploadedPhrases$.subscribe((phrases: Array<Phrase>) => {
          this.phrasesService.setData(phrases.filter((phrase) => phrase?.show !== '-'));
          this.checkData(this.phrasesService.data);
        });
        break;
      default:
        break;
    }
  }

  private _service!: AdverbsService | VerbsService | NounsService | AdjectivesService | ConjunctionsService | PhrasesService;

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

  private checkData(adverbs: Array<GrammaticalType>): void {
    if (adverbs.length < 2) {
      this._service.setIsValidData(false);
      this.messageService.add({ severity: 'error', summary: Text.notEnoughText, detail: Text.addMoreDataText });
      return;
    }
    const keys = Object.keys(adverbs[0]);
    keys.forEach((key) => {
      if (!this._service.validKeys.includes(key)) {
        this._service.setIsValidData(false);
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
    // todo: switch
    this._service.initVariables();
    this.messageService.add({
      severity: 'warn',
      summary: `${this._service.name.charAt(0).toUpperCase()}${this._service.name.slice(1)} éffacés.`
    });
  }

  // todo: switch
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
  }
  private selectAdverbs(): void {
    if (this._service.priority !== undefined) {
      this._service.setCurrentItem(undefined);
      const priority = +this._service.priority;
      const selectedData = (this._service.data as Array<GrammaticalType>).filter((adverb) =>
        +adverb.priority === priority
      );
      this._service.setSelectedData(selectedData as any);
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
  }

  private selectCurrentItem(): void {
    const currentIndex = this._service.index.current;
    if (currentIndex !== undefined) {
      this._service.setCurrentItem(this._service.selectedData[currentIndex] as any);
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
