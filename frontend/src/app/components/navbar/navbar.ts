import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent implements OnInit {
  username: string = 'User';

  constructor(private router: Router) {}

  ngOnInit() {
    const userData = localStorage.getItem('user');

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);

        if (parsedUser.fullName) {
          this.username = parsedUser.fullName;
        } else if (parsedUser.user && parsedUser.user.fullName) {
          this.username = parsedUser.user.fullName;
        } else {
          this.username = 'User';
        }
      } catch (error) {
        console.error('Error reading user data:', error);
      }
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
