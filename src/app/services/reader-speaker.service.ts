import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ReaderSpeakerService {

  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpClient
  ) {
    this.baseUrl = 'https://freetts.com/Home/PlayAudio';
  }

  getVoice(TextMessage: string): Observable<any> {
    return this.http.get(`${this.baseUrl}`,
      {
        params: {
          Language: 'da-DK',
          Voice: 'da-DK-Standard-A',
          type: 0,
          TextMessage
        },
      });
  }

  getUrl(response: { id: string; }): string {
    return `https://freetts.com/audio/${response?.id}`;
  }

}
