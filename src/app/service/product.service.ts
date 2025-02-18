import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Product } from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiBaseUrl;
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<{ data: Product[] }>(`${this.baseUrl}/products`).pipe(
      map(response => response.data)
    );
  }

  postProduct(product: Product): Observable<Product> {
    return this.http.post<{ data: Product }>(`${this.baseUrl}/products`, product).pipe(
      map(response => response.data)
    );
  }

  viewProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${productId}`);
  }

  validateId(productId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/products/verification/${productId}`);
  }

  putProduct(product: Product): Observable<Product> {
    return this.http.put<{ data: Product }>(`${this.baseUrl}/products/${product.id}`, product).pipe(
      map(response => response.data)
    );
  }

  deleteProduct(productId: string): Observable<Product> {
    return this.http.delete<Product>(`${this.baseUrl}/products/${productId}`);
  }

}
