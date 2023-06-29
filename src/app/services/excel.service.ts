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
    return this._uploadedFile$.asObservable()
      .pipe(
        map(file => {
          if (!file) {
            this.messageService.add({ severity: 'warn', summary: Text.fileRemoved });
            return null;
          }
          let isValid = true;
          Object.keys(file).forEach(key => {
            const items = file[key];
            if (items.length === 0) {
              isValid = false;
              this.messageService.add({ severity: 'error', summary: Text.invalidTab + key, detail: Text.emptyDataMessage });
            } else {
              if (Object.keys(items[0]).some((key) => !this.validKeys.includes(key))) {
                isValid = false;
                this.messageService.add({ severity: 'error', summary: Text.invalidTab + key, detail: Text.invalidColumnMessage });
              }
              if (items.some(item =>
                !item.source_language || !item.target_language || !item.source || !item.target || !item.priority
              )) {
                isValid = false;
                this.messageService.add({ severity: 'error', summary: Text.invalidTab + key, detail: Text.incompleteMessage });
              }
              if (items.some(({ source_language, target_language }) =>
                ![source_language, target_language].every(language => Object.keys(Language).includes(language as Language))
              )) {
                isValid = false;
                this.messageService.add(
                  { severity: 'error', summary: Text.invalidTab + key, detail: `${Text.unsupportedLanguageTextMessage} ${this.getLanguages()}` }
                );
              }
            }
          });
          if (!isValid) {
            return null;
          }
          this.messageService.add({ severity: 'success', summary: Text.validFile });
          return file;
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
