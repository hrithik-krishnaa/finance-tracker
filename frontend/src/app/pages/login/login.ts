import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';
  loading = false;

  constructor(private api: ApiService, private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Please enter both email and password.';
      return;
    }

    this.loading = true;
    this.api.login(this.email, this.password).subscribe({
      next: (res: any) => {
        console.log('Login success:', res);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMsg = 'Invalid credentials. Please try again.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
