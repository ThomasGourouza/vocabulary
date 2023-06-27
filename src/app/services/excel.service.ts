import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { Observable, Subject, map } from 'rxjs';
import { Item } from 'src/app/models/item';
import { Text } from 'src/app/models/text';
import { MessageService } from 'primeng/api';
import { Language } from '../models/language';

@Injectable()
export class ExcelService {
  constructor(private messageService: MessageService) { }

  private validKeys = [
    "source_language",
    "target_language",
    "source",
    "target",
    "priority"
  ];

  private _uploadedData$ = new Subject<Item[]>();

  get uploadedData$(): Observable<Item[]> {
    return this._uploadedData$.asObservable()
      .pipe(
        map((data) => {
          if (data.length > 0) {
            if (Object.keys(data[0]).some((key) => !this.validKeys.includes(key))) {
              this.messageService.add({ severity: 'error', summary: Text.invalidText, detail: Text.invalidTextMessage });
              return [{ source_language: '', target_language: '', source: '', target: '', priority: 0 }];
            }
            if (data.some(item =>
              !item.source_language || !item.target_language || !item.source || !item.target || !item.priority
            )) {
              this.messageService.add({ severity: 'error', summary: Text.incomplete, detail: Text.incompleteTextMessage });
              return [{ source_language: '', target_language: '', source: '', target: '', priority: 0 }];
            }
            if (data.some(({ source_language, target_language }) =>
              ![source_language, target_language].every(language => Object.keys(Language).includes(language as Language))
            )) {
              this.messageService.add({ severity: 'error', summary: Text.unsupportedLanguage, detail: Text.unsupportedLanguageTextMessage });
              return [{ source_language: '', target_language: '', source: '', target: '', priority: 0 }];
            }
            this.messageService.add({ severity: 'success', summary: Text.validText });
            return data;
          }
          this.messageService.add({ severity: 'warn', summary: Text.dataDeletedText });
          return data;
        }));
  }

  public excelToJSON(file: File): void {
    const reader = new FileReader();
    reader.onload = ((e) => {
      if (e.target == null) {
        return;
      }
      const data = e.target.result;
      const workbook = XLSX.read(data, {
        type: 'binary'
      });
      workbook.SheetNames.forEach((sheetName) => {
        const data: Item[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        this._uploadedData$.next(data);
      });
    });
    reader.readAsBinaryString(file);
  }

  public reset(): void {
    this._uploadedData$.next([]);
  }
}
