import { Injectable } from '@angular/core';
import { GrammarName } from '../models/grammar-name';
import { Key } from '../models/key';
import { GrammarService } from './grammar.service';

@Injectable()
export class NounsService extends GrammarService {

  constructor() {
    super();
    this.setProperties(
      GrammarName.NOUNS,
      1,
      [
        Key.FRENCH,
        Key.DANISH,
        Key.GENDER,
        Key.PRIORITY,
        Key.SHOW
      ],
      { title: GrammarName.NOUNSTITEL, singular: GrammarName.NOUN }
    );
  }
}
