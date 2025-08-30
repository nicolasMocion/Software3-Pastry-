import { Component, OnInit } from '@angular/core';
import { ProductsService, Product } from './services/products.service';
import { NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor],
  template: `
    <h1>Products</h1>
    <ul>
      <li *ngFor="let product of products">
        {{ product.name }} - {{ '$' + product.base_price }}
      </li>
    </ul>
  `
})
export class AppComponent implements OnInit {
  products: Product[] = [];

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.productsService.getProducts().subscribe({
      next: (data: Product[]) => this.products = data,
      error: (err) => console.error('Error fetching products:', err)
    });
  }
}
