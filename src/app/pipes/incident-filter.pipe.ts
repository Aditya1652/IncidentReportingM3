import { Pipe, PipeTransform } from '@angular/core';
import { Incident } from '../models/incident.model';

@Pipe({
  name: 'incidentFilter',
})
export class IncidentFilterPipe implements PipeTransform {
  transform(incidents: Incident[], filterBy: string): Incident[] {
    if (!incidents || !filterBy) {
      return incidents;
    }

    return incidents.filter(
      (incident) =>
        incident.status === filterBy || incident.priority === filterBy
    );
  }
}
