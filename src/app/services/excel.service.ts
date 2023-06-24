import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { Item } from '../models/item';

@Injectable()
export class ExcelService {
  private _uploadedWords$ = new Subject<Array<Item>>();
  private _priorities$ = new Subject<Array<number>>();

  get uploadedWords$(): Observable<Array<Item>> {
    return this._uploadedWords$.asObservable();
  }

  get priorities$(): Observable<Array<number>> {
    return this._priorities$.asObservable();
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
        const sheet: Array<Item> = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        const priorities: Array<number> = [];
        sheet?.map((item) => item?.priority)?.forEach((priority: number) => {
          if (!priorities.includes(priority)) {
            priorities.push(priority);
          }
        });
        this._priorities$.next(priorities);
        this._uploadedWords$.next(sheet);
      });
    });
    reader.readAsBinaryString(file);
  }

}
