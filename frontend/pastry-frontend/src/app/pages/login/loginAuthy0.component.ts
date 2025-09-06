import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-authy',
  standalone: true,
  template: `
    <div class="login-container">
      <h2>Welcome back!</h2>
      <p>Please log in to continue.</p>
      <button (click)="login()">Login with Auth0</button>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 80vh;
    }
    button {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      background-color: #eb5424;
      color: white;
      font-size: 1rem;
      cursor: pointer;
    }
    button:hover {
      background-color: #c73f18;
    }
  `]
})
export class LoginAuthyComponent {
  constructor(private auth: AuthService) {}

  login() {
    this.auth.loginWithRedirect();
  }
}
