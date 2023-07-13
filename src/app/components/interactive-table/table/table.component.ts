import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from 'src/app/models/item';
import { JapaneseWord, KuroshiroService } from '../../../services/kuroshiro.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {
  @Input() item: Item | undefined;
  @Input() showTarget!: boolean;
  @Input() isSourceColFirst!: boolean;

  public japaneseWords$!: Observable<JapaneseWord[]>;

  constructor(private kuroshiroService: KuroshiroService) {}

  ngOnInit(): void {
    this.japaneseWords$ = this.kuroshiroService.japaneseWords$;
  }
}
