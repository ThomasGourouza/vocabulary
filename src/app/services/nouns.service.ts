import { Injectable } from '@angular/core';
import { GrammarName } from '../models/grammar-name';
import { GrammarService } from './grammar.service';

@Injectable()
export class NounsService extends GrammarService {

  constructor() {
    super();
    this.setProperties(
      GrammarName.NOUNS,
      1,
      [
        'french',
        'danish',
        'gender',
        'priority',
        'show'
      ]
    );
  }
}
