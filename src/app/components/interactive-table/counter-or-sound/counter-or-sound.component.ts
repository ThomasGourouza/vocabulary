import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Index } from '../interactive-table.component';

@Component({
  selector: 'app-counter-or-sound',
  templateUrl: './counter-or-sound.component.html'
})
export class CounterOrSoundComponent {
  @Input() isNotEnoughItem!: boolean;
  @Input() currentIndex!: Index;
  @Input() isPlaying!: boolean;
  @Input() isFrenchColFirst!: boolean;
  @Input() isReadSpeakerActivated!: boolean;
  @Input() position!: 'left' | 'right';
  @Output() readSpeak = new EventEmitter<number>();

  public onReadSpeak(): void {
    if (this.isPlaying
      || this.isNotEnoughItem
      || this.currentIndex.number === undefined
      || (this.isFrenchColFirst && !this.currentIndex.showSecondWord)
    ) {
      return;
    }
    const index: number = this.currentIndex.number;
    this.readSpeak.emit(index);
  }
}
