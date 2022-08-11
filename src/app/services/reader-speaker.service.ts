import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ReaderSpeakerService {

  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpClient
  ) {
    this.apiKey = 'f56b242feemsh5739e24d3615074p140966jsnbd5c78425fff';
    this.baseUrl = `https://voicerss-text-to-speech.p.rapidapi.com/?key=${this.apiKey}`;
  }

  getVoice(text: string): Observable<any> {
    const body = new URLSearchParams();
    body.append("f", "8khz_8bit_mono");
    body.append("c", "mp3");
    body.append("r", "0");
    body.append("hl", "da-DK");
    body.append("src", text);

    // const bod = {
    //   "f": "8khz_8bit_mono",
    //   "c": "mp3",
    //   "r": "0",
    //   "hl": "da-DK",
    //   "src": text
    // };

    const headers: { [header: string]: string; } = {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': 'voicerss-text-to-speech.p.rapidapi.com'
    };

    return this.http.post(`${this.baseUrl}`, body, headers).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        
        return of('error');
      })
    );
  }


}
