import { Injectable } from '@angular/core';
import { GrammarName } from '../models/grammar-name';
import { GrammarService } from './grammar.service';

@Injectable()
export class AdjectivesService extends GrammarService {

  constructor() {
    super();
    this.setProperties(
      GrammarName.ADJECTIVES,
      4,
      [
        'french',
        'danish',
        'priority',
        'show'
      ]
    );
  }

}
