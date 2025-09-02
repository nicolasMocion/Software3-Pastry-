import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../services/menu.service';
import { Pastry } from '../../models/pastry.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  pastries: Pastry[] = [];
  filteredPastries: Pastry[] = [];
  selectedCategory: string = 'all';

  categories = [
    { value: 'all', label: 'Todos' },
    { value: 'cake', label: 'Tortas' },
    { value: 'cupcake', label: 'Cupcakes' },
    { value: 'cookie', label: 'Galletas' },
    { value: 'bread', label: 'Panes' },
    { value: 'special', label: 'Especiales' }
  ];

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.loadPastries();
  }

  loadPastries() {
    this.menuService.getAllPastries().subscribe(pastries => {
      this.pastries = pastries;
      this.filteredPastries = pastries;
    });
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'all') {
      this.filteredPastries = this.pastries;
    } else {
      this.filteredPastries = this.pastries.filter(pastry => pastry.category === category);
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }
}
