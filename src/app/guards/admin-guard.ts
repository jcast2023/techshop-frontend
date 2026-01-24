import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuth = authService.isLoggedIn;
  const isAdmin = authService.isAdmin;

  if (isAuth && isAdmin) {
    return true;
  }


  Swal.fire({
    title: 'Acceso Restringido',
    text: 'Se requieren permisos de administrador para acceder a esta sección.',
    icon: 'warning',
    confirmButtonColor: '#0d6efd',
    confirmButtonText: 'Entendido'
  });

  if (isAuth) {
    router.navigate(['/']);
  } else {
    router.navigate(['/login']);
  }

  return false;
};
