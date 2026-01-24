
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css'
})
export class MyOrders implements OnInit {
  pedidos: any[] = [];
  cargando = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {

this.http.get<any[]>('http://localhost:8080/api/pedidos').subscribe({
  next: (data) => {

    this.pedidos = data.map(pedido => ({...pedido, verDetalle: false}));
    this.cargando = false;
  },
  error: () => this.cargando = false
});
  }


generarPDF(pedido: any) {
  console.log('Generando factura para el pedido:', pedido.idPedido);


  const url = `http://localhost:8080/api/pedidos/${pedido.idPedido}/factura`;


  window.open(url, '_blank');
}

descargarFactura(idPedido: number) {

  this.http.get(`http://localhost:8080/api/pedidos/${idPedido}/factura`, {
    responseType: 'blob'
  }).subscribe({
    next: (res: Blob) => {
      const fileURL = URL.createObjectURL(res);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `factura_pedido_${idPedido}.pdf`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(fileURL), 100);
    },
    error: (err) => {
      console.error('Error en descarga:', err);
      alert('Error al generar el PDF. Asegúrate de que tu sesión siga activa.');
    }
  });
}
}
