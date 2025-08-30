import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface for Product (aligns with backend fields)
export interface Product {
  id?: number;
  category_id: number;
  name: string;
  description: string;
  base_price: number;
  preparation_time_hours: number;
  image_url: string;
  is_customizable: boolean;
  is_active: boolean;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private apiUrl = 'http://localhost:3000/api/products'; // ✅ backend URL

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
