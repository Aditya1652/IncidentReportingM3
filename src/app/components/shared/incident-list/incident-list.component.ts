import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Incident } from '../../../models/incident.model';

@Component({
  selector: 'app-incident-list',
  templateUrl: './incident-list.component.html',
})
export class IncidentListComponent {
  @Input() incidents: Incident[] = [];
  @Input() isAdmin: boolean = false;
  @Output() incidentUpdated = new EventEmitter<Incident>();

  filterBy: string = '';

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'low':
        return 'bg-success';
      case 'medium':
        return 'bg-warning';
      case 'high':
        return 'bg-danger';
      default:
        return '';
    }
  }

  onIncidentUpdated(updatedIncident: Incident): void {
    const index = this.incidents.findIndex(
      (inc) => inc.id === updatedIncident.id
    );
    if (index !== -1) {
      this.incidents[index] = updatedIncident;
      this.incidentUpdated.emit(updatedIncident);
    }
  }
}
