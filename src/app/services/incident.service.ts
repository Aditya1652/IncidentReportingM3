import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Incident } from '../models/incident.model';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  private apiUrl =
    'https://incident-reporting-6cd82-default-rtdb.firebaseio.com/incidents';
  private incidentsSubject = new BehaviorSubject<Incident[]>([]);

  constructor(private http: HttpClient) {
    this.loadIncidents();
  }

  private loadIncidents() {
    this.http
      .get<{ [key: string]: Incident }>(`${this.apiUrl}.json`)
      .pipe(
        map((response) => {
          const incidents: Incident[] = [];
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              incidents.push({ ...response[key], id: key });
            }
          }
          return incidents;
        })
      )
      .subscribe(
        (incidents) => this.incidentsSubject.next(incidents),
        (error) => console.error('Error loading incidents', error)
      );
  }

  getIncidents(): Observable<Incident[]> {
    return this.incidentsSubject.asObservable();
  }

  getIncidentsByReporter(reporterId: string): Observable<Incident[]> {
    return this.getIncidents().pipe(
      map((incidents) =>
        incidents.filter((incident) => incident.assignedTo === reporterId)
      )
    );
  }

  createIncident(incident: Incident): Observable<Incident> {
    return this.http.post<Incident>(`${this.apiUrl}.json`, incident).pipe(
      tap((newIncident) => {
        const currentIncidents = this.incidentsSubject.value;
        this.incidentsSubject.next([
          ...currentIncidents,
          { ...incident, id: newIncident.title },
        ]);
      })
    );
  }

  updateIncident(id: string, incident: Partial<Incident>): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}.json`, incident).pipe(
      tap(() => {
        const currentIncidents = this.incidentsSubject.value;
        const updatedIncidents = currentIncidents.map((inc) =>
          inc.id === id ? { ...inc, ...incident } : inc
        );
        this.incidentsSubject.next(updatedIncidents);
      })
    );
  }

  deleteIncident(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}.json`).pipe(
      tap(() => {
        const currentIncidents = this.incidentsSubject.value;
        const updatedIncidents = currentIncidents.filter(
          (inc) => inc.id !== id
        );
        this.incidentsSubject.next(updatedIncidents);
      })
    );
  }
}
