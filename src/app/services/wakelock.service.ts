import { Injectable } from '@angular/core';

@Injectable()
export class WakelockService {
  private wakeLock: any;

  constructor() { }

  public requestWakeLock(): void {
    if ('wakeLock' in navigator && (navigator as any).wakeLock !== undefined) {
      (navigator as any).wakeLock
        .request('screen')
        .then((wakeLockObj: any) => {
          this.wakeLock = wakeLockObj;
          console.log('Wake lock is active!');
        })
        .catch((err: any) => {
          console.error(`Failed to request wake lock: ${err}`);
        });
    } else {
      console.error('Wake Lock API is not supported.');
    }
  }

  public releaseWakeLock(): void {
    if (this.wakeLock) {
      this.wakeLock
        .release()
        .then(() => {
          console.log('Wake lock has been released.');
        })
        .catch((err: any) => {
          console.error(`Failed to release wake lock: ${err}`);
        });
    }
  }
}
