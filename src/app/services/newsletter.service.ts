import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  private apiUrl = 'http://localhost:8080/api/newsletter/suscribir';

  constructor(private http: HttpClient) {}

  registrarCorreo(email: string) {
    return this.http.post(this.apiUrl, { email });
  }
}
