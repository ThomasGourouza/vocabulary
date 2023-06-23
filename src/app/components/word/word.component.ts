import { Component } from '@angular/core';
import { WordService } from 'src/app/services/word.service';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html'
})
export class WordComponent {

  constructor(
    public wordService: WordService
  ) { }

}
