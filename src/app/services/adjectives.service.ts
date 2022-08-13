import { Injectable } from '@angular/core';
import { GrammarName } from '../models/grammar-name';
import { Key } from '../models/key';
import { GrammarService } from './grammar.service';

@Injectable()
export class AdjectivesService extends GrammarService {

  constructor() {
    super();
    this.setProperties(
      GrammarName.ADJECTIVES,
      4,
      [
        Key.FRENCH,
        Key.DANISH,
        Key.PRIORITY,
        Key.SHOW
      ],
      { title: GrammarName.ADJECTIVESTITEL, singular: GrammarName.ADJECTIVE }
    );
  }

}
