import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-registration-link',
  templateUrl: './admin-registration-link.component.html',
})
export class AdminRegistrationLinkComponent {
  secretKey: string = '';
  error: string = '';
  showForm: boolean = false;

  constructor(private router: Router) {}

  onSubmit(): void {
    const correctKey = 'admin123';

    if (this.secretKey === correctKey) {
      this.router.navigate(['/admin-registration']);
    } else {
      this.error = 'Invalid secret key';
    }
  }
}
