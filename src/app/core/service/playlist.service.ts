import { Injectable } from '@angular/core';
import { RespostaExceptionsDTO } from '../model/exceptions/resposta-exceptions-dto';
import { MusicaDTO } from '../model/musica/musica-dto';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
    API = 'http://localhost:8080/moodfy/playlist/';
  
    respostaExceptionsDTO = new RespostaExceptionsDTO();
  
    constructor(private http: HttpClient) { }
  
    gerarPlaylist(prompt: string): Observable<MusicaDTO[]> {
      return this.http
        .post<MusicaDTO[]>(this.API + `gerarPlaylist`, prompt)
        .pipe(catchError(this.handleError));
    }
  
    private handleError(error: HttpErrorResponse) {
      return throwError(() => error.error);
    }
}
