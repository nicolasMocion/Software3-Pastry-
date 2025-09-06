import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-register-admin',
  templateUrl: './registerAdmin.component.html',
  imports: [
    ReactiveFormsModule
  ],
  styleUrls: ['./registerAdmin.component.css']
})
export class RegisterAdminComponent {
  registerForm: FormGroup;
  roles: string[] = ['Admin', 'Manager', 'Employee']; // 🔥 This will later come from backend

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Register form data:', this.registerForm.value);
      // TODO: send to backend with selected role
    }
  }
}
