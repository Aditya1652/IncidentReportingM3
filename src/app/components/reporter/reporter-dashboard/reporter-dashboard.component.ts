import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Incident } from '../../../models/incident.model';
import { IncidentService } from '../../../services/incident.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reporter-dashboard',
  templateUrl: './reporter-dashboard.component.html',
})
export class ReporterDashboardComponent implements OnInit, OnDestroy {
  incidents: Incident[] = [];
  reporterId: string;
  private incidentSubscription: Subscription;

  constructor(
    private incidentService: IncidentService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.reporterId = this.authService.currentUserValue?.id || '';
  }

  ngOnInit(): void {
    if (!this.reporterId) {
      this.router.navigate(['/login']);
    } else {
      this.loadIncidents();
    }
  }

  ngOnDestroy(): void {
    if (this.incidentSubscription) {
      this.incidentSubscription.unsubscribe();
    }
  }

  loadIncidents(): void {
    this.incidentSubscription = this.incidentService
      .getIncidentsByReporter(this.reporterId)
      .subscribe(
        (incidents) => (this.incidents = incidents),
        (error) => console.error('Error loading incidents', error)
      );
  }

  updateIncident(incident: Incident): void {
    this.incidentService.updateIncident(incident.id!, incident).subscribe(
      () => {
        console.log('Incident updated successfully');
      },
      (error) => console.error('Error updating incident', error)
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login'], { queryParams: { logout: 'true' } });
  }
}
