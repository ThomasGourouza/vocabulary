import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Index } from '../interactive-table.component';

@Component({
  selector: 'app-counter-or-sound',
  templateUrl: './counter-or-sound.component.html'
})
export class CounterOrSoundComponent {
  @Input() isDataEmpty!: boolean;
  @Input() currentIndex!: Index;
  @Input() isPlaying!: boolean;
  @Input() isSourceColFirst!: boolean;
  @Input() isReadSpeakerActivated!: boolean;
  @Input() position!: 'left' | 'right';
  @Output() readSpeak = new EventEmitter<number>();

  constructor() {}

  public onReadSpeak(): void {
    if (this.isPlaying
      || this.isDataEmpty
      || this.currentIndex.number === undefined
      || (this.isSourceColFirst && !this.currentIndex.showTarget)
      || this.position !== (this.isSourceColFirst ? 'right' : 'left')
    ) return;
    const index: number = this.currentIndex.number;
    this.readSpeak.emit(index);
  }
}
