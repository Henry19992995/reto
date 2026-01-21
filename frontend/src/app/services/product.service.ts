import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductResponse } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private getApiUrl(): string {
    if (typeof window !== 'undefined') {
      const port = window.location.port;
      const hostname = window.location.hostname;
      // En Docker (puerto 4210) usar el proxy de nginx
      if (port === '4210' || port === '8080') {
        return '/api/bp/products';
      }
      // En desarrollo local (puerto 4200, 4201) conectar directamente al backend
      if (port === '4200' || port === '4201' || (hostname === 'localhost' && port === '')) {
        return 'http://localhost:3002/bp/products';
      }
    }
    // Por defecto usar el proxy de nginx
    return '/api/bp/products';
  }

  private get apiUrl(): string {
    return this.getApiUrl();
  }

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(this.apiUrl);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  verifyIdentifier(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verification/${id}`);
  }

  createProduct(product: Product): Observable<any> {
    return this.http.post(`${this.apiUrl}`, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
