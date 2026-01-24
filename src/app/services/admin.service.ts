import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}


  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pedidos`);
  }


  updateStock(id: number, quantity: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/productos/${id}/stock`, { stock: quantity });
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/stats`);
  }
}
