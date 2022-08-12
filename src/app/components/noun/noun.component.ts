import { Component } from '@angular/core';
import { NounsService } from 'src/app/services/nouns.service';

@Component({
  selector: 'app-noun',
  templateUrl: './noun.component.html'
})
export class NounComponent {

  constructor(
    public nounsService: NounsService
  ) { }

}
