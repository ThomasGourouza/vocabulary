import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Index } from '../interactive-table.component';
import { ReaderSpeakerService } from 'src/app/services/reader-speaker.service';
import { Observable, filter } from 'rxjs';

@Component({
  selector: 'app-counter-or-sound',
  templateUrl: './counter-or-sound.component.html'
})
export class CounterOrSoundComponent implements OnInit {
  @Input() isDataEmpty!: boolean;
  @Input() currentIndex!: Index;
  @Input() isPlaying!: boolean;
  @Input() isSourceColFirst!: boolean;
  @Input() isReadSpeakerActivated!: boolean;
  @Input() position!: 'left' | 'right';
  @Output() readSpeak = new EventEmitter<number>();

  public audioSource$!: Observable<any>;

  constructor(private readerSpeakerService: ReaderSpeakerService) {}

  ngOnInit(): void {
    this.audioSource$ = this.readerSpeakerService.audioSource$.pipe(
      filter(_ => this.position === (this.isSourceColFirst ? 'right' : 'left'))
    );
    // TODO
    this.audioSource$.subscribe(audioSource => {
      console.log(this.position, audioSource);
    });
  }

  public onReadSpeak(): void {
    if (this.isPlaying
      || this.isDataEmpty
      || this.currentIndex.number === undefined
      || (this.isSourceColFirst && !this.currentIndex.showTarget)
    ) return;
    const index: number = this.currentIndex.number;
    this.readSpeak.emit(index);
  }
}
