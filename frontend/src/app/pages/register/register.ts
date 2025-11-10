import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  fullName: string = '';
  email: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';
  success: string = '';

  constructor(private api: ApiService, private router: Router) {}

  register() {
    if (!this.fullName || !this.email || !this.password) {
      this.error = 'Please fill all fields.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.api.register(this.email, this.password, this.fullName).subscribe({
      next: (res) => {
        console.log('Registration success:', res);
        this.success = 'Account created successfully!';
        alert('Registration successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        this.error = 'Email already exists or invalid input.';
      }
    }).add(() => {
      this.loading = false;
    });
  }
}
