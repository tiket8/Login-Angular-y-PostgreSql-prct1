// Servicio Angular para el manejo de operaciones con usuarios incluye los metodos:
// login envia credenciales al backen y recibe tokens 
//register envia datos del nuevo usuario al backend y recibe token
// setToken guarda el token en la coockes
// getToken obtiene el token
// getUserInfo obtiene informacion del usuario desde el backen usando el token

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private cookies: CookieService) {}

  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  setToken(token: string) {
    this.cookies.set('token', token);
  }

  getToken(): string {
    return this.cookies.get('token');
  }

  getUserInfo(): Observable<any> {
    const token = this.getToken();
    return this.http.get(`${this.apiUrl}/user`, { headers: { 'Authorization': `Bearer ${token}` } });
  }
}
