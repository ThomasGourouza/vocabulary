import { Injectable } from '@angular/core';
import { GrammarName } from '../models/grammar-name';
import { Key } from '../models/key';
import { GrammarService } from './grammar.service';

@Injectable()
export class ConjunctionsService extends GrammarService {

  constructor() {
    super();
    this.setProperties(
      GrammarName.CONJUNCTIONS,
      5,
      [
        Key.FRENCH,
        Key.DANISH,
        Key.PRIORITY,
        Key.SHOW
      ],
      { title: GrammarName.CONJUNCTIONSTITEL, singular: GrammarName.CONJUNCTION }
    );
  }

}
