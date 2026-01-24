import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private myAppUrl: string = environment.apiUrl;
  private myApiUrl: string = '/pedidos';

  constructor(private http: HttpClient) { }

  pagarPedido(id: number): Observable<any> {
    return this.http.put(`${this.myAppUrl}${this.myApiUrl}/${id}/pagar`, {});
  }

  descargarFactura(id: number): Observable<Blob> {
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}/${id}/factura`, {
      responseType: 'blob'
    });
  }
}
