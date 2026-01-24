import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit {
  cartItems: CartItem[] = [];
  total = 0;

  constructor(
    private cartService: CartService,
    public productService: ProductService,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  proceedToCheckout(): void {
    if (!this.authService.isLoggedIn) {
      Swal.fire('Sesión Expirada', 'Por favor, reingresa a tu cuenta.', 'warning');
      this.authService.logout();
      return;
    }

    const user = this.authService.getUserData();
    if (!user || !user.idUsuario) {
      Swal.fire('Error', 'No se pudo identificar al usuario logueado.', 'error');
      return;
    }

    const pedidoDTO = {
      idUsuario: user.idUsuario,
      total: this.total,
      fechaPedido: new Date().toISOString(),
      estado: 'PENDIENTE',
      items: this.cartItems.map(item => ({
        idProducto: item.product.idProducto,
        cantidad: item.quantity,
        precioUnitario: item.product.precio
      }))
    };


    Swal.fire({
      title: 'Procesando pedido...',
      text: 'Estamos preparando tu orden en TechShop',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.http.post('http://localhost:8080/api/pedidos', pedidoDTO).subscribe({
      next: (pedidoCreado: any) => {

        Swal.fire({
          title: '¡Pedido realizado!',
          text: 'Redirigiendo a la pasarela de pago...',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.cartService.clearCart();
          this.router.navigate(['/pago', pedidoCreado.idPedido]);
        });
      },
      error: (err) => {
        console.error('Error detallado:', err);
        Swal.fire({
          title: 'Error 403 / Servidor',
          text: 'No tienes permisos o el servidor falló. Revisa tu conexión.',
          icon: 'error'
        });
      }
    });
  }

  updateQuantity(item: CartItem, change: number): void {
    const newQty = item.quantity + change;
    const idProd = item.product.idProducto;
    if (idProd && newQty >= 1 && newQty <= (item.product.stock || 99)) {
      this.cartService.updateQuantity(idProd, newQty);
    }
  }

  removeItem(item: CartItem): void {
    const idProd = item.product.idProducto;
    if (idProd) {

      Swal.fire({
        title: '¿Quitar producto?',
        text: `Se eliminará ${item.product.nombre} del carrito.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, quitar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.cartService.removeFromCart(idProd);
        }
      });
    }
  }
}
