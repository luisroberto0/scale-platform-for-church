import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  userRole!: string;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.getUser().subscribe((user: { role: string; } | null) => {
      if (user && user.role) { // Add null check for user
        this.userRole = user.role;
        if (this.userRole !== 'publisher' && this.userRole !== 'viewer' && this.userRole !== 'admin') {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
