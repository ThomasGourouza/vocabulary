import { Component, Input } from '@angular/core';
import { Gender } from 'src/app/models/gender';
import { Grammar } from 'src/app/models/grammar';

@Component({
  selector: 'app-table-noun',
  templateUrl: './table-noun.component.html'
})
export class TableNounComponent {

  @Input() public data!: Array<Grammar>;
  @Input() public currentItem: Grammar | undefined;
  @Input() public firstNext!: boolean;

  public print(gender: string | undefined): string {
    switch (gender) {
      case 'M':
        return Gender.M;
      case 'F':
        return Gender.F;
      case 'N':
        return Gender.N;
      case 'P':
        return Gender.P;
      default:
        return '?';
    }
  }

}
