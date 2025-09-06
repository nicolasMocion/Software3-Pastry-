// complete-profile.component.ts
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" style="display:grid; gap:12px; max-width:360px">
      <input formControlName="fullName" placeholder="Full name" />
      <input formControlName="phone" placeholder="Phone (+57...)" />
      <input formControlName="cc" placeholder="CC" />
      <select formControlName="user_role_id">
        <option value="rol_user">User</option>
        <option value="rol_admin">Admin</option>
      </select>
      <button type="submit" [disabled]="form.invalid || submitting">Save</button>
    </form>
  `
})
export class CompleteProfileComponent {
  submitting = false;
  uid = new URLSearchParams(location.search).get('uid') || '';

  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.minLength(7)]],
    cc: ['', [Validators.required, Validators.minLength(5)]],
    user_role_id: ['rol_user', Validators.required],
  });

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  async submit() {
    if (this.form.invalid || this.submitting) return;
    this.submitting = true;
    try {
      // Ensure we have a userId (auth0_id). If not in query, try fetching from backend session.
      let userId = this.uid;
      if (!userId) {
        try {
          const me: any = await this.http
            .get('http://localhost:3000/api/me', { withCredentials: true })
            .toPromise();
          if (me && me.auth0_id) userId = me.auth0_id;
        } catch {}
      }

      if (!userId) {
        alert('No se pudo determinar el usuario. Vuelve a iniciar sesión.');
        return;
      }

      await this.http
        .post(
          'http://localhost:4200/api/profile/completeProfile',
          { userId, ...this.form.value },
          { withCredentials: true }
        )
        .toPromise();

      // Enter the app
      window.location.href = '/';
    } catch (e) {
      console.error('Complete profile error', e);
      alert('No se pudo guardar el perfil. Intenta de nuevo.');
    } finally {
      this.submitting = false;
    }
  }
}
