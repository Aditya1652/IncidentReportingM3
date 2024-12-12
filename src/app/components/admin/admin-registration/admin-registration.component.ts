import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-registration',
  templateUrl: './admin-registration.component.html',
})
export class AdminRegistrationComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.signup('admin', this.email, this.password, true).subscribe(
      (user) => {
        console.log('Admin registration successful:', user);
        this.router.navigate(['/admin']);
      },
      (error) => {
        console.error('Admin registration error', error);
        this.error =
          error.error.error.message || 'An error occurred during registration';
      }
    );
  }
}
