import { Component } from '@angular/core';
import { ConjunctionsService } from 'src/app/services/conjunctions.service';

@Component({
  selector: 'app-conjunction',
  templateUrl: './conjunction.component.html'
})
export class ConjunctionComponent {

  constructor(
    public conjunctionsService: ConjunctionsService
  ) { }

}
