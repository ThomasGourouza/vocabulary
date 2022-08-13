import { Injectable } from '@angular/core';
import { GrammarName } from '../models/grammar-name';
import { GrammarService } from './grammar.service';

@Injectable()
export class VerbsService extends GrammarService {

  constructor() {
    super();
    this.setVariables(
      GrammarName.VERBS,
      2,
      [
        'french',
        'danish',
        'conjugation',
        'priority',
        'show'
      ]
    );
  }

}
