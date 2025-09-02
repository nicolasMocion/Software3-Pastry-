import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  values = [
    {
      title: 'Calidad',
      description: 'Utilizamos solo ingredientes de primera calidad para garantizar el mejor sabor en cada bocado.'
    },
    {
      title: 'Tradición',
      description: 'Nuestras recetas han sido perfeccionadas a lo largo de los años, manteniendo el sabor tradicional.'
    },
    {
      title: 'Innovación',
      description: 'Combinamos técnicas tradicionales con ideas modernas para crear productos únicos.'
    },
    {
      title: 'Compromiso',
      description: 'Nos comprometemos a brindar la mejor experiencia en cada pedido y ocasión especial.'
    }
  ];
}
