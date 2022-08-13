import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { Grammar } from '../models/grammar';

@Injectable()
export class ExcelService {

  private _uploadedVerbs$ = new Subject<Array<Grammar>>();
  private _uploadedNouns$ = new Subject<Array<Grammar>>();
  private _uploadedAdjectives$ = new Subject<Array<Grammar>>();
  private _uploadedConjunctions$ = new Subject<Array<Grammar>>();
  private _uploadedAdverbs$ = new Subject<Array<Grammar>>();
  private _uploadedPhrases$ = new Subject<Array<Grammar>>();
  private _priorities$ = new Subject<Array<number>>();
  
  get uploadedVerbs$(): Observable<Array<Grammar>> {
    return this._uploadedVerbs$.asObservable();
  }
  get uploadedNouns$(): Observable<Array<Grammar>> {
    return this._uploadedNouns$.asObservable();
  }
  get uploadedAdjectives$(): Observable<Array<Grammar>> {
    return this._uploadedAdjectives$.asObservable();
  }
  get uploadedConjunctions$(): Observable<Array<Grammar>> {
    return this._uploadedConjunctions$.asObservable();
  }
  get uploadedAdverbs$(): Observable<Array<Grammar>> {
    return this._uploadedAdverbs$.asObservable();
  }
  get uploadedPhrases$(): Observable<Array<Grammar>> {
    return this._uploadedPhrases$.asObservable();
  }
  get priorities$(): Observable<Array<number>> {
    return this._priorities$.asObservable();
  }

  public excelToJSON(name: string, file: File): void {
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
        const sheet: Array<Grammar> = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        const priorities: Array<number> = [];
        sheet?.map((item) => item?.priority)?.forEach((priority: number) => {
          if (!priorities.includes(priority)) {
            priorities.push(priority);
          }
        });
        this._priorities$.next(priorities);
        switch (name) {
          case 'verbes':
            this._uploadedVerbs$.next(sheet);
            break;
          case 'noms':
            this._uploadedNouns$.next(sheet);
            break;
          case 'adjectifs':
            this._uploadedAdjectives$.next(sheet);
            break;
          case 'conjonctions':
            this._uploadedConjunctions$.next(sheet);
            break;
          case 'adverbes':
            this._uploadedAdverbs$.next(sheet);
            break;
          case 'expressions':
            this._uploadedPhrases$.next(sheet);
            break;
          default:
            break;
        }
      });
    });
    reader.readAsBinaryString(file);
  }

}
