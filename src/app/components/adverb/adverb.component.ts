import { Component } from '@angular/core';
import { AdverbsService } from 'src/app/services/adverbs.service';

@Component({
  selector: 'app-adverb',
  templateUrl: './adverb.component.html'
})
export class AdverbComponent {

  constructor(
    public adverbsService: AdverbsService
  ) { }

}
