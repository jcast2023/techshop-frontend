import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentMethod } from '../../models/payment.model';
import { PagoService } from '../../services/pago.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {
  idPedido!: number;
  procesando = false;
  pagoExitoso = false;
  metodoSeleccionado = 'card';

  metodos: PaymentMethod[] = [
    { id: 'card', name: 'Tarjeta de Crédito', icon: 'bi-credit-card', description: 'Visa, Mastercard, Amex' },
    { id: 'paypal', name: 'PayPal', icon: 'bi-paypal', description: 'Pago rápido y seguro' },
    { id: 'transfer', name: 'Transferencia', icon: 'bi-bank', description: 'Banca por internet' }
  ];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private pagoService: PagoService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.idPedido = +id;
    } else {
      this.router.navigate(['/']);
    }
  }

  confirmarPago() {
    if (this.procesando) return;
    this.procesando = true;

    this.pagoService.pagarPedido(this.idPedido).subscribe({
      next: () => {

        Swal.fire({
          title: '¡Pago Autorizado!',
          text: 'Tu pedido ha sido procesado correctamente.',
          icon: 'success',
          confirmButtonColor: '#198754',
          confirmButtonText: 'Ver comprobante'
        }).then(() => {
          this.pagoExitoso = true;
          this.procesando = false;
        });
      },
      error: (err) => {
        const mensajeError = err.error?.mensaje || 'Error al procesar el pago.';
        console.error('Error:', mensajeError);


        Swal.fire({
          title: 'Pago Declinado',
          text: mensajeError,
          icon: 'error',
          confirmButtonColor: '#dc3545'
        });
        this.procesando = false;
      }
    });
  }

  bajarFactura() {
    this.pagoService.descargarFactura(this.idPedido).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factura_${this.idPedido}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);


        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Descargando factura...',
          showConfirmButton: false,
          timer: 2000
        });
      },
      error: (err) => {
        Swal.fire('Error', 'No se pudo generar la factura en este momento.', 'error');
      }
    });
  }
}
