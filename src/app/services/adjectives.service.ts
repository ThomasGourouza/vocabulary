import { Injectable } from '@angular/core';
import { ItemService } from './item.service';

@Injectable()
export class AdjectivesService extends ItemService {

  constructor() {
    super();
    this.setProperties(
      "adjectifs",
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
