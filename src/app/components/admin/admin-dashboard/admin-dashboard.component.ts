import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Incident } from '../../../models/incident.model';
import { User } from '../../../models/user.model';
import { IncidentService } from '../../../services/incident.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  incidents: Incident[] = [];
  reporters: User[] = [];
  error: string = '';

  constructor(
    private incidentService: IncidentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadIncidents();
    this.loadReporters();
  }

  loadIncidents(): void {
    this.incidentService.getIncidents().subscribe(
      (incidents) => (this.incidents = incidents),
      (error) => {
        console.error('Error loading incidents', error);
        this.error = 'Failed to load incidents. Please try again later.';
      }
    );
  }

  loadReporters(): void {
    this.authService.getAllUsers().subscribe(
      (users) => {
        this.reporters = users.filter((user) => user.role === 'reporter');
      },
      (error) => {
        console.error('Error loading users', error);
        this.error = 'Failed to load users. Please try again later.';
      }
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login'], { queryParams: { logout: 'true' } });
  }
}
