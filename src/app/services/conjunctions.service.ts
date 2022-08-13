import { Injectable } from '@angular/core';
import { GrammarName } from '../models/grammar-name';
import { GrammarService } from './grammar.service';

@Injectable()
export class ConjunctionsService extends GrammarService {

  constructor() {
    super();
    this.setVariables(
      GrammarName.CONJUNCTIONS,
      5,
      [
        'french',
        'danish',
        'priority',
        'show'
      ]
    );
  }

}
