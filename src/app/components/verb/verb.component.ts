import { Component } from '@angular/core';
import { VerbsService } from 'src/app/services/verbs.service';

@Component({
  selector: 'app-verb',
  templateUrl: './verb.component.html'
})
export class VerbComponent {

  constructor(
    public verbsService: VerbsService
  ) { }

}
