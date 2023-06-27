import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';
import { Index } from '../interactive-table.component';

export interface ReadSpeakIndex {
  index: number;
  position: 1 | 2;
}

@Component({
  selector: 'app-counter-or-sound',
  templateUrl: './counter-or-sound.component.html'
})
export class CounterOrSoundComponent implements OnInit, OnDestroy {
  @Input() isNotEnoughItem!: boolean;
  @Input() currentIndex!: Index;
  @Input() isPlaying!: boolean;
  @Input() position!: 'left' | 'right';
  @Output() readSpeak = new EventEmitter<ReadSpeakIndex>();

  public isFrenchColFirst!: boolean;
  public isReadSpeakerActivated!: boolean;
  public isFrenchColFirstSubscription!: Subscription;
  public isReadSpeakerActivatedSubscription!: Subscription;

  constructor(
    private readerSpeakerService: ReaderSpeakerService
  ) { }

  ngOnInit(): void {
    this.isReadSpeakerActivatedSubscription = this.readerSpeakerService.isReadSpeakerActivated$
      .subscribe(value => this.isReadSpeakerActivated = value);
    this.isFrenchColFirstSubscription = this.readerSpeakerService.isFrenchColFirst$
      .subscribe(value => this.isFrenchColFirst = value);
  }

  ngOnDestroy(): void {
    this.isFrenchColFirstSubscription.unsubscribe();
    this.isReadSpeakerActivatedSubscription.unsubscribe();
  }

  public onReadSpeak(): void {
    if (this.isPlaying
      || this.isNotEnoughItem
      || !this.currentIndex.number
      || !this.currentIndex.showSecondWord
    ) {
      return;
    }
    const index = this.currentIndex.number;
    const position = this.isFrenchColFirst ? 2 : 1;
    this.readSpeak.emit({ index, position });
  }
}
