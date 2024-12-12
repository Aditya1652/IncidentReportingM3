import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  name: string = '';
  isRegistering: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleRegistration(): void {
    this.isRegistering = !this.isRegistering;
    this.error = '';
  }

  onSubmit(): void {
    if (this.isRegistering) {
      this.signup();
    } else {
      this.login();
    }
  }

  private signup(): void {
    this.authService
      .signup(this.name, this.email, this.password, false)
      .subscribe(
        (user) => {
          console.log('Signup successful:', user);
          this.router.navigate([`/reporter/${user.id}`]);
        },
        (errorMessage) => {
          console.error('Signup error', errorMessage);
          this.error = errorMessage;
        }
      );
  }

  private login(): void {
    this.authService.login(this.email, this.password).subscribe(
      (user) => {
        console.log('Login successful:', user);
        if (user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate([`/reporter/${user.id}`]);
        }
      },
      (errorMessage) => {
        console.error('Login error', errorMessage);
        this.error = errorMessage;
      }
    );
  }
}
