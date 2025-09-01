import { Component, OnInit } from '@angular/core';
import { ProductsService, Producto } from './services/products.service';
import { NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor],
  template: `
    <h1>Productos</h1>
    <ul>
      <li *ngFor="let producto of productos">
        {{ producto.product_name }} - {{ '$' + producto.unit_price }}
      </li>
    </ul>
  `
})
export class AppComponent implements OnInit {
  productos: Producto[] = [];

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.productsService.getProducts().subscribe({
      next: (data: Producto[]) => this.productos = data,
      error: (err) => console.error('Error fetching products:', err)
    });
  }
}
