import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pastry } from '../models/pastry.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private pastries: Pastry[] = [
    {
      id: 1,
      name: 'Torta de Chocolate',
      description: 'Deliciosa torta de chocolate con ganache y decoración artesanal',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
      category: 'cake',
      available: true
    },
    {
      id: 2,
      name: 'Cupcakes de Vainilla',
      description: 'Suaves cupcakes de vainilla con buttercream de colores',
      price: 8000,
      image: 'https://images.unsplash.com/photo-1587736500617-7293b30c3146?w=400',
      category: 'cupcake',
      available: true
    },
    {
      id: 3,
      name: 'Galletas Decoradas',
      description: 'Galletas artesanales decoradas con glaseado real',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400',
      category: 'cookie',
      available: true
    },
    {
      id: 4,
      name: 'Pan Artesanal',
      description: 'Pan fresco horneado diariamente con ingredientes naturales',
      price: 12000,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
      category: 'bread',
      available: true
    },
    {
      id: 5,
      name: 'Torta Red Velvet',
      description: 'Clásica torta red velvet con cream cheese frosting',
      price: 52000,
      image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400',
      category: 'cake',
      available: true
    },
    {
      id: 6,
      name: 'Macarons Franceses',
      description: 'Delicados macarons con diferentes sabores',
      price: 4500,
      image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400',
      category: 'special',
      available: true
    },
    {
      id: 7,
      name: 'Cheesecake de Frutos Rojos',
      description: 'Cremoso cheesecake con coulis de frutos rojos',
      price: 38000,
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400',
      category: 'cake',
      available: true
    },
    {
      id: 8,
      name: 'Brownies Premium',
      description: 'Brownies fudgy con nueces y chocolate belga',
      price: 6500,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
      category: 'special',
      available: true
    }
  ];

  constructor() { }

  getAllPastries(): Observable<Pastry[]> {
    return of(this.pastries);
  }

  getPastriesByCategory(category: string): Observable<Pastry[]> {
    const filtered = this.pastries.filter(pastry => pastry.category === category);
    return of(filtered);
  }

  getPastryById(id: number): Observable<Pastry | undefined> {
    const pastry = this.pastries.find(p => p.id === id);
    return of(pastry);
  }
}
