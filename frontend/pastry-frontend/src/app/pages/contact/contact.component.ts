import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;
  showSuccessMessage = false;

  contactInfo = [
    {
      icon: '📍',
      title: 'Ubicación',
      info: 'Armenia, Quindío, Colombia'
    },
    {
      icon: '📞',
      title: 'Teléfono',
      info: '+57 300 123 4567'
    },
    {
      icon: '✉️',
      title: 'Email',
      info: 'info@misiajuaca.com'
    },
    {
      icon: '🕒',
      title: 'Horarios',
      info: 'Lun - Sáb: 8:00 AM - 8:00 PM'
    }
  ];

  onSubmit() {
    if (this.isValidForm()) {
      this.isSubmitting = true;

      // Simulate form submission
      setTimeout(() => {
        this.isSubmitting = false;
        this.showSuccessMessage = true;
        this.resetForm();

        // Hide success message after 5 seconds
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 5000);
      }, 2000);
    }
  }

  isValidForm(): boolean {
    return !!(this.contactForm.name &&
      this.contactForm.email &&
      this.contactForm.message);
  }

  resetForm() {
    this.contactForm = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    };
  }
}
