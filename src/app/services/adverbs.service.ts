import { Injectable } from '@angular/core';
import { GrammarName } from '../models/grammar-name';
import { Key } from '../models/key';
import { GrammarService } from './grammar.service';

@Injectable()
export class AdverbsService extends GrammarService {

  constructor() {
    super();
    this.setProperties(
      GrammarName.ADVERBS,
      3,
      [
        Key.FRENCH,
        Key.DANISH,
        Key.PRIORITY,
        Key.SHOW
      ],
      { title: GrammarName.ADVERBSTITEL, singular: GrammarName.ADVERB }
    );
  }

}
