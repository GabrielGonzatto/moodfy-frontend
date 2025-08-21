import { Injectable } from '@angular/core';
import { RespostaExceptionsDTO } from '../model/exceptions/resposta-exceptions-dto';
import { MusicaDTO } from '../model/musica/musica-dto';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MusicaService {
  API = 'http://localhost:8080/moodfy/musica/';

  respostaExceptionsDTO = new RespostaExceptionsDTO();
  
  constructor(private http: HttpClient) {}

  gerarMusica(listaDeMusica: string): Observable<MusicaDTO> {
    return this.http
      .post<MusicaDTO>(this.API + `gerarMusica`, listaDeMusica)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error);
  }
}
