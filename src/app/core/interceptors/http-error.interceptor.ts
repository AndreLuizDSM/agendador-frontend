import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth.services';

// HttpInterceptorFn é o tipo moderno de interceptor do Angular (functional interceptor).
// Recebe a requisição (req) e a função next (que passa o request adiante na cadeia).
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {

  // inject() funciona dentro de contextos de injeção do Angular,
  // como interceptors funcionais, guards e factories.
  const snackBar = inject(MatSnackBar);
  const router   = inject(Router);
  const auth     = inject(Auth);

  // next(req) executa a requisição HTTP.
  // pipe(catchError(...)) intercepta qualquer erro que a API retornar.
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      // Mensagem padrão caso o status não seja tratado explicitamente.
      let mensagem = 'Ocorreu um erro inesperado. Tente novamente.';

      switch (error.status) {

        // Status 0 significa que a requisição não chegou ao servidor:
        // sem internet, servidor offline ou CORS bloqueando.
        case 0:
          mensagem = 'Sem conexão com o servidor. Verifique sua internet.';
          break;

        // 401 pode ser duas situações distintas:
        // → sem token: credenciais inválidas (tentativa de login)
        // → com token: token expirou durante a sessão
        case 401:
          if (auth.getToken()) {
            mensagem = 'Sua sessão expirou. Faça login novamente.';
            auth.logout();
            router.navigate(['/login'], { replaceUrl: true });
          } else {
            mensagem = 'Email ou senha inválidos.';
          }
          break;

        // 403: o token é válido, mas o usuário não tem permissão para aquele recurso.
        case 403:
          mensagem = 'Você não tem permissão para realizar essa ação.';
          break;

        // 404: o recurso solicitado não existe na API.
        case 404:
          mensagem = 'Recurso não encontrado.';
          break;

        case 409:
          mensagem = 'Email já existente.';
          break;

          // 500: erro interno no servidor Spring Boot.
        case 500:
          mensagem = 'Erro interno no servidor. Tente novamente mais tarde.';
          break;
      }

      // Exibe a mensagem de erro como um snackbar (toast) no canto da tela.
      // duration: tempo em ms antes de fechar automaticamente.
      // panelClass: classe CSS aplicada ao snackbar para customizar cor/estilo.
      snackBar.open(mensagem, 'Fechar', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-error'],
      });

      // throwError propaga o erro para o .subscribe({ error: ... }) do componente,
      // caso ele queira tratar algo específico além da mensagem global.
      return throwError(() => error);
    })
  );
};
