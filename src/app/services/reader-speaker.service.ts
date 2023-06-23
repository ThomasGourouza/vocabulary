import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ReaderSpeakerService {

  private readonly baseUrl: string;

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

}
