import { Injectable } from '@angular/core';
import { GrammarName } from '../models/grammar-name';
import { Key } from '../models/key';
import { GrammarService } from './grammar.service';

@Injectable()
export class PhrasesService extends GrammarService {

  constructor() {
    super();
    this.setProperties(
      GrammarName.PHRASES,
      6,
      [
        Key.FRENCH,
        Key.DANISH,
        Key.PRIORITY,
        Key.SHOW
      ],
      { title: GrammarName.PHRASESTITEL, singular: GrammarName.PHRASE }
    );
  }

}
