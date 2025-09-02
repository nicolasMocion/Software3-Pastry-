import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com/misiajuaca', icon: '📘' },
    { name: 'Instagram', url: 'https://instagram.com/misiajuaca', icon: '📷' },
    { name: 'WhatsApp', url: 'https://wa.me/573001234567', icon: '📱' }
  ];
}
