import { Injectable } from '@angular/core';
import { GrammarName } from '../models/grammar-name';
import { GrammarService } from './grammar.service';

@Injectable()
export class AdverbsService extends GrammarService {

  constructor() {
    super();
    this.setVariables(
      GrammarName.ADVERBS,
      3,
      [
        'french',
        'danish',
        'priority',
        'show'
      ]
    );
  }

}
