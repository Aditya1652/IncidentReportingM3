import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Incident } from '../../../models/incident.model';
import { User } from '../../../models/user.model';
import { IncidentService } from '../../../services/incident.service';

@Component({
  selector: 'app-incident-assignment',
  templateUrl: './incident-assignment.component.html',
})
export class IncidentAssignmentComponent {
  @Input() reporters: User[] = [];
  @Output() incidentCreated = new EventEmitter<void>();

  incidentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private incidentService: IncidentService
  ) {
    this.incidentForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required],
      assignedTo: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.incidentForm.valid) {
      const newIncident: Incident = {
        ...this.incidentForm.value,
        status: 'Open',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.incidentService.createIncident(newIncident).subscribe(
        () => {
          this.incidentCreated.emit();
          this.incidentForm.reset();
        },
        (error) => console.error('Error creating incident', error)
      );
    }
  }
}
