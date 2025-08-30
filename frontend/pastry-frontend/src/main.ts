import 'zone.js';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';


bootstrapApplication(AppComponent, { // Hace a angular pendiente del cliente de manera global
  providers: [
    provideHttpClient()
  ]
});

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './index.html',
  styleUrl: './styles.css'
})
export class App {
  protected readonly title = signal('pastry-frontend');
}
