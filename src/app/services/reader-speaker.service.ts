import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ReaderSpeakerService {

  private readonly baseUrl: string;
  private _isReadSpeakerActivated$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly http: HttpClient
  ) {
    this.baseUrl = 'https://ttsmp3.com/makemp3_new.php';
  }

  getVoice(TextMessage: string): Observable<any> {
    return this.http.post(`${this.baseUrl}`,
      {
        params: {
          msg:	TextMessage,
          lang:	"Tatyana",
          source:	"ttsmp3"
        },
      });
  }

  getUrl(response: { id: string; }): string {
    return `https://freetts.com/audio/${response?.id}`;
  }

  get isReadSpeakerActivated$(): Observable<boolean> {
    return this._isReadSpeakerActivated$.asObservable();
  }

  setIsReadSpeakerActivated$(activated: boolean) {
    this._isReadSpeakerActivated$.next(activated);
  }

}
