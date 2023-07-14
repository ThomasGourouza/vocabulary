import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Text } from '../models/text';

@Injectable()
export class WakelockService {
  private wakeLock: any;

  constructor(private messageService: MessageService) { }

  public requestWakeLock(): Promise<boolean> {
    return new Promise((resolve) => {
      if ('wakeLock' in navigator && (navigator as any).wakeLock !== undefined) {
        (navigator as any).wakeLock.request('screen')
          .then((wakeLockObj: any) => {
            this.wakeLock = wakeLockObj;
            this.messageService.add({ severity: 'info', summary: Text.screenLocked });
            resolve(true);
          }).catch(() =>
            resolve(false)
          );
      } else {
        resolve(false);
      }
    });
  }

  public releaseWakeLock(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.wakeLock) {
        this.wakeLock.release()
          .then(() => {
            this.messageService.add({ severity: 'info', summary: Text.screenUnlocked });
            resolve(false);
          }).catch((err: any) => {
            this.messageService.add({ severity: 'warn', summary: Text.screenUnlockFailed, detail: err });
            resolve(true);
          });
      } else {
        resolve(false);
      }
    });
  }
}
