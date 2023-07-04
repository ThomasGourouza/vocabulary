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
  public priority: number | undefined;

  constructor(
    private excelService: ExcelService
  ) { }

  ngOnInit(): void {
    this.file$ = this.excelService.file$.pipe(shareReplay(1));
  }

  onPriority(priority: number | undefined): void {
    this.priority = priority;
  }

  onTab(tab: string | undefined): void {
    this.tab = tab;
  }
}
