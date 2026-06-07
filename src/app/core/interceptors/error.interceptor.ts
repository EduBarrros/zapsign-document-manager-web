import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Ocorreu um erro inesperado.';
      if (error.error?.error?.message) {
        message = error.error.error.message;
      } else if (error.error?.detail) {
        message = error.error.detail;
      } else if (error.status === 0) {
        message = 'Sem conexão com o servidor.';
      } else if (error.status === 401) {
        message = 'Não autorizado. Faça login novamente.';
      } else if (error.status === 403) {
        message = 'Acesso negado.';
      } else if (error.status === 404) {
        message = 'Recurso não encontrado.';
      }
      notification.error(message);
      return throwError(() => error);
    })
  );
};
