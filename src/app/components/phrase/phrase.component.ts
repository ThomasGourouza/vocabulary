import { Component } from '@angular/core';
import { PhrasesService } from 'src/app/services/phrases.service';

@Component({
  selector: 'app-phrase',
  templateUrl: './phrase.component.html'
})
export class PhraseComponent {

  constructor(
    public phrasesService: PhrasesService
  ) { }

}
