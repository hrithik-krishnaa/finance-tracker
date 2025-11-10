import { Component } from '@angular/core';
import { ApiService } from '../../services/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  loading = false;
  error = '';
  success = '';

  constructor(private api: ApiService, private router: Router) {}

  register(): void {
    if (!this.fullName || !this.email || !this.password) {
      this.error = 'Please fill in all fields.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const userData = {
      fullName: this.fullName,
      email: this.email,
      password: this.password
    };

    this.api.register(userData).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.success = 'Registration successful! You can now log in.';
        console.log('✅ Registration response:', res);
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        console.error('❌ Registration error:', err);
        this.loading = false;
        this.error = 'Failed to register. Please try again.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
