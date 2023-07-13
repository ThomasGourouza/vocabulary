import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Observable, Subject, map } from 'rxjs';
import { Item } from '../models/item';
import { Text } from '../models/text';
import { Language } from '../models/language';
import { MessageService } from 'primeng/api';
import { KuroshiroService } from './kuroshiro.service';

@Injectable()
export class ExcelService {
  constructor(
    private messageService: MessageService,
    private kuroshiroService: KuroshiroService,
  ) { }

  private validHeaders = [
    "source_language",
    "target_language",
    "source",
    "target",
    "tag"
  ];

  private _uploadedFile$ = new Subject<{ [tab: string]: Item[]; } | null>();

  get file$(): Observable<{ [tab: string]: Item[]; } | null> {
    return this._uploadedFile$.asObservable()
      .pipe(
        map(file => {
          this.messageService.clear();
          if (!file) {
            this.messageService.add({ severity: 'warn', summary: Text.fileRemoved });
            return null;
          }
          let isValid = true;
          Object.keys(file).forEach(tab => {
            const items = file[tab];
            if (items.length === 0) {
              isValid = false;
              this.messageService.add({ severity: 'error', summary: Text.invalidTab + tab, detail: Text.emptyDataMessage, sticky: true });
            } else {
              if (Object.keys(items[0]).some((header) => !this.validHeaders.includes(header))) {
                isValid = false;
                this.messageService.add({ severity: 'error', summary: Text.invalidTab + tab, detail: Text.invalidColumnMessage, sticky: true });
              }
              if (items.some(item =>
                [item.source_language, item.target_language, item.source, item.target, item.tag].some(value =>
                  value === null || value === undefined || value.toString().trim() === ''
                )
              )) {
                isValid = false;
                this.messageService.add({ severity: 'error', summary: Text.invalidTab + tab, detail: Text.incompleteMessage, sticky: true });
              }
              if (items.some(({ source_language, target_language }) =>
                ![source_language, target_language].every(language => Object.keys(Language).includes((language?.toLowerCase()) as Language))
              )) {
                isValid = false;
                this.messageService.add(
                  { severity: 'error', summary: Text.invalidTab + tab, detail: `${Text.unsupportedLanguageTextMessage} ${this.getLanguages()}`, sticky: true }
                );
              }
              // fill japaneseWords from kuroshiro service
              items.forEach(item => {
                if (item.target_language.toLowerCase() === 'japanese') {
                  this.kuroshiroService.addJapaneseWord(item.target);
                }
              });
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
      if (event.target == null) return;
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
