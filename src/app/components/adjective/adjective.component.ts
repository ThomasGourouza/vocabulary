import { Component } from '@angular/core';
import { AdjectivesService } from 'src/app/services/adjectives.service';

@Component({
  selector: 'app-adjective',
  templateUrl: './adjective.component.html'
})
export class AdjectiveComponent {

  constructor(
    public adjectivesService: AdjectivesService
  ) { }

}
