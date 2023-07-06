import { Component, OnInit } from '@angular/core';
import { Item } from './models/item';
import { ExcelService } from './services/excel.service';
import { Observable, shareReplay } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public file$!: Observable<{ [tab: string]: Item[]; } | null>;
  public tab: string | undefined;
  public tag: string | undefined;

  constructor(
    private excelService: ExcelService
  ) { }

  ngOnInit(): void {
    this.file$ = this.excelService.file$.pipe(shareReplay(1));
  }

  onTag(tag: string | undefined): void {
    this.tag = tag;
  }

  onTab(tab: string | undefined): void {
    this.tab = tab;
  }
}
