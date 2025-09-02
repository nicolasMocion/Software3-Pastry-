import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  features = [
    {
      icon: '🍰',
      title: 'Ingredientes Frescos',
      description: 'Utilizamos solo los mejores ingredientes naturales para nuestras creaciones.'
    },
    {
      icon: '👩‍🍳',
      title: 'Recetas Artesanales',
      description: 'Cada producto es elaborado a mano siguiendo recetas tradicionales.'
    },
    {
      icon: '🎂',
      title: 'Pedidos Personalizados',
      description: 'Creamos tortas y pasteles únicos para tus ocasiones especiales.'
    }
  ];
}
