import { Injectable } from '@angular/core';
import { GrammarName } from '../models/grammar-name';
import { Key } from '../models/key';
import { GrammarService } from './grammar.service';

@Injectable()
export class VerbsService extends GrammarService {

  constructor() {
    super();
    this.setProperties(
      GrammarName.VERBS,
      2,
      [
        Key.FRENCH,
        Key.DANISH,
        Key.CONJUGATION,
        Key.PRIORITY,
        Key.SHOW
      ],
      { title: GrammarName.VERBSTITEL, singular: GrammarName.VERB }
    );
  }

}
