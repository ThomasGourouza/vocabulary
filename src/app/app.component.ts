import { Component, OnInit } from '@angular/core';
import { Item } from './models/item';
import { ExcelService } from './services/excel.service';
import { Observable, shareReplay } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public data$!: Observable<Item[]>;
  public priority: number | undefined;

  constructor(
    private excelService: ExcelService
  ) { }

  ngOnInit(): void {
    this.data$ = this.excelService.uploadedWords$.pipe(shareReplay(1));
  }

  onPriority(priority: number): void {
    this.priority = priority;
  }

}
