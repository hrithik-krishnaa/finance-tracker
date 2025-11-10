import { Component } from '@angular/core';
import { ApiService } from '../../services/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  loading = false;
  errorMsg = '';

  constructor(private api: ApiService, private router: Router) {}

  login(): void {
    if (!this.email || !this.password) {
      this.errorMsg = 'Please fill in both email and password.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    const credentials = {
      email: this.email,
      password: this.password
    };

    this.api.login(credentials).subscribe({
      next: (res: any) => {
        this.loading = false;
        console.log('✅ Login response:', res);

        if (res?.token) localStorage.setItem('token', res.token);
        if (res?.user) localStorage.setItem('user', JSON.stringify(res.user));

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('❌ Login error:', err);
        this.loading = false;
        this.errorMsg = 'Invalid email or password.';
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
