import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  idUser?: number;
  nome: string;
  email: string;
  senha?: string;
  celular?: string;
  cpf?: string;
  dtNascimento?: string;
  pais?: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = environment.apiUrl;
  private authUrl = environment.authUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public isAuthenticated$ = this.currentUserSubject.asObservable();

  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    // Carrega o usuário salvo no localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      // Atualiza o usuário atual
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }


  // Faz o login do usuário
  login(email: string, senha: string): Observable<any> {
    // Verifica se os dados de login foram enviados
    if (!email || !senha) {
      console.error('Email ou senha vazios');
      return throwError(() => new Error('Email e senha são obrigatórios'));
    }

    // Cria um objeto com os dados de login
    const loginData = {
      email: email.trim(),
      senha: senha
    };

    // Faz a requisição de login
    return this.http.post<any>(`${this.authUrl}/login/`, loginData, this.httpOptions)
      .pipe(
        tap(response => {
          // Loga a resposta do login
          console.log('Resposta do login:', response);

          // Verifica se a resposta é válida e contém um ID
          if (response && response.id) {
            const user: User = {
              idUser: response.id,
              nome: response.nome,
              email: email
            };

            // Atualiza o usuário atual 
            this.currentUserSubject.next(user);

            // Salva o usuário no localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
        }),
        catchError(this.handleError)
      );
  }


  // Registra o usuário
  register(user: User): Observable<any> {
    // Faz a requisição de registro
    return this.http.post<any>(`${this.apiUrl}/usuarios/`, user, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }


  // Retorna o usuário atual
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }


  // Faz o logout do usuário
  logout() {
    // Remove o usuário do localStorage
    localStorage.removeItem('currentUser');

    // Atualiza o usuário atual
    this.currentUserSubject.next(null);

    // Redireciona para a página de login
    this.router.navigate(['/login']);
  }


  // Trata os erros da requisição
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
        errorMessage = 'Email ou senha incorretos';

      } else if (error.status === 422) {
        errorMessage = 'Dados inválidos. Verifique o formato dos dados enviados.';
        console.error('Detalhes do erro 422:', error.error);

      } else if (error.status === 0) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
      }
    }
    
    // Retorna o erro
    return throwError(() => new Error(errorMessage));
  }
}
