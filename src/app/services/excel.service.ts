import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { Item } from '../models/item';

@Injectable()
export class ExcelService {
  private _uploadedWords$ = new Subject<Array<Item>>();

  get uploadedWords$(): Observable<Array<Item>> {
    return this._uploadedWords$.asObservable();
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
        const data: Array<Item> = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        this._uploadedWords$.next(data);
      });
    });
    reader.readAsBinaryString(file);
  }

}
