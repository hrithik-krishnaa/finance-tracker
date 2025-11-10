import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5041';

  constructor(private http: HttpClient) {}

  register(email: string, password: string, fullName: string): Observable<any> {
    const body = { email, password, fullName };
    return this.http.post(`${this.baseUrl}/api/Auth/register`, body);
  }

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.baseUrl}/api/Auth/login`, body);
  }

  getTransactions(userId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/api/Transactions/${userId}`, { headers });
  }

  addTransaction(transaction: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/api/Transactions/add`, transaction, { headers });
  }

  getAiInsights(transactions: any[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/ai/insights`, { transactions });
  }
}
