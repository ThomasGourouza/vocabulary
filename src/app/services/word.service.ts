import { Injectable } from '@angular/core';
import { ItemService } from './item.service';

@Injectable()
export class WordService extends ItemService {

  constructor() {
    super();
    this.setProperties(
      "mots",
      4,
      [
        "french",
        "word",
        "priority",
        "show"
      ]
    );
  }

}
