import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Cartao {
  idCartao?: number;
  nmTitular: string;
  numero: string;
  dtExpiracao: string;
  cvv: string;
  bandeira: string;
}

@Injectable({
  providedIn: 'root'
})

export class CardService {
  private apiUrl = environment.apiUrl;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient
  ) {}


  // Adiciona um novo cartão
  adicionarCartao(cartao: Cartao): Observable<{ id: number }> {
    // ex.: localhost:8000/api/cartoes/
    return this.http.post<{ id: number }>(`${this.apiUrl}/cartoes/`, cartao, this.httpOptions)
      .pipe(
        tap(response => {
          console.log('Resposta ao adicionar cartão:', response);
        }),
        catchError(this.handleError)
      );
  }


  // Lista todos os cartões do usuário
  listarCartoes(): Observable<Cartao[]> {
    // ex.: localhost:8000/api/cartoes/
    return this.http.get<Cartao[]>(`${this.apiUrl}/cartoes/`, this.httpOptions)
      .pipe(
        tap(response => {
          console.log('Resposta ao listar cartões:', response);
        }),
        catchError(this.handleError)
      );
  }


  // Obtém um cartão específico pelo ID
  obterCartao(id: number): Observable<Cartao> {
    // ex.: localhost:8000/api/cartoes/1/
    return this.http.get<Cartao>(`${this.apiUrl}/cartoes/${id}/`, this.httpOptions)
      .pipe(
        tap(response => {
          console.log('Resposta ao obter cartão:', response);
        }),
        catchError(this.handleError)
      );
  }


  // Deleta um cartão
  deletarCartao(id: number): Observable<{ detail: string }> {
    // ex.: localhost:8000/api/cartoes/1/
    return this.http.delete<{ detail: string }>(`${this.apiUrl}/cartoes/${id}/`, this.httpOptions)
      .pipe(
        tap(response => {
          console.log('Resposta ao deletar cartão:', response);
        }),
        catchError(this.handleError)
      );
  }


  // Manipulador de erros
  private handleError(error: HttpErrorResponse) {
    console.error('Erro na requisição:', error);

    // Mensagem de erro padrão
    let errorMessage = 'Ocorreu um erro na requisição';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do servidor
      if (error.status === 401) {
        errorMessage = 'Não autorizado';

      } else if (error.status === 422) {
        errorMessage = 'Dados inválidos. Verifique o formato dos dados enviados.';
        console.error('Detalhes do erro 422:', error.error);

      } else if (error.status === 0) {
        errorMessage = 'Não foi possível conectar ao servidor, verifique se o servidor está rodando. Possível erro de CORS.';
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}