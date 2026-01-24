import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user = {
    nombre: '',
    username: '',
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {

    Swal.fire({
      title: 'Creando cuenta...',
      text: 'Por favor, espera un momento.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.register(this.user).subscribe({
      next: (res: any) => {

        Swal.fire({
          title: '¡Registro exitoso!',
          text: 'Tu cuenta ha sido creada. Ya puedes iniciar sesión.',
          icon: 'success',
          confirmButtonColor: '#007bff'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err: any) => {

        Swal.fire({
          title: 'Error al registrar',
          text: err.error?.message || 'Ocurrió un problema técnico. Intenta más tarde.',
          icon: 'error',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }
}
