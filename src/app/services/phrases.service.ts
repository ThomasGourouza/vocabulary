import { Injectable } from '@angular/core';
import { GrammarName } from '../models/grammar-name';
import { GrammarService } from './grammar.service';

@Injectable()
export class PhrasesService extends GrammarService {

  constructor() {
    super();
    this.setProperties(
      GrammarName.PHRASES,
      6,
      [
        'french',
        'danish',
        'priority',
        'show'
      ]
    );
  }

}
