import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  let authReq = req;


  if (token) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!router.url.includes('/login')) {


        if (error.status === 401) {
          authService.logout();
          Swal.fire({
            title: 'Sesión Expirada',
            text: 'Tu sesión ha terminado. Por favor, ingresa de nuevo.',
            icon: 'info',
            confirmButtonText: 'Ir al Login'
          }).then(() => router.navigate(['/login']));
        }


        else if (error.status === 403) {
          Swal.fire({
            title: 'Acceso Denegado',
            text: 'No tienes permisos para realizar esta acción o ver este recurso.',
            icon: 'error',
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'Entendido'
          });

        }
      }
      return throwError(() => error);
    })
  );
};
