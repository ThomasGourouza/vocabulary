import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
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

  private _uploadedFile$ = new Subject<{ [tab: string]: Item[]; } | null>();

  get file$(): Observable<{ [tab: string]: Item[]; } | null> {
    return this._uploadedFile$.asObservable();
  }

  get items$(): Observable<Item[]> {
    return this._uploadedFile$.asObservable()
      .pipe(
        map(file => {
          if (!file) {
            return [];
          }
          const items = file[''];
          if (!items) {
            return [];
          }
          if (items.length > 0) {
            if (Object.keys(items[0]).some((key) => !this.validKeys.includes(key))) {
              this.messageService.add({ severity: 'error', summary: Text.invalidText, detail: Text.invalidTextMessage });
              return [{ source_language: '', target_language: '', source: '', target: '', priority: 0 }];
            }
            if (items.some(item =>
              !item.source_language || !item.target_language || !item.source || !item.target || !item.priority
            )) {
              this.messageService.add({ severity: 'error', summary: Text.incomplete, detail: Text.incompleteTextMessage });
              return [{ source_language: '', target_language: '', source: '', target: '', priority: 0 }];
            }
            if (items.some(({ source_language, target_language }) =>
              ![source_language, target_language].every(language => Object.keys(Language).includes(language as Language))
            )) {
              this.messageService.add(
                { severity: 'error', summary: Text.unsupportedLanguage, detail: `${Text.unsupportedLanguageTextMessage} ${this.getLanguages()}` }
              );
              return [{ source_language: '', target_language: '', source: '', target: '', priority: 0 }];
            }
            this.messageService.add({ severity: 'success', summary: Text.validText });
            return items;
          }
          this.messageService.add({ severity: 'warn', summary: Text.fileDeletedText });
          return items;
        }));
  }

  public excelToJSON(file: File): void {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target == null) {
        return;
      }
      const items = event.target.result;
      const workbook = XLSX.read(items, { type: 'binary' });

      const jsonData: { [sheetName: string]: Item[] } = {};

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const sheetData: Item[] = XLSX.utils.sheet_to_json(worksheet);
        jsonData[sheetName] = sheetData;
      });

      this._uploadedFile$.next(jsonData);
    };
    reader.readAsBinaryString(file);
  }

  public reset(): void {
    this._uploadedFile$.next(null);
  }

  private getLanguages(): string {
    const languages = Object.keys(Language);
    const lastLanguage = languages.pop();
    const joinedLanguages = languages.join(', ');
    return `${joinedLanguages} and ${lastLanguage}.`;
  }
}
