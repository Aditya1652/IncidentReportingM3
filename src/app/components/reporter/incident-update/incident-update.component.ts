import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Incident } from '../../../models/incident.model';
import { IncidentService } from '../../../services/incident.service';

@Component({
  selector: 'app-incident-update',
  templateUrl: './incident-update.component.html',
})
export class IncidentUpdateComponent {
  @Input() incident!: Incident;
  @Output() incidentUpdated = new EventEmitter<Incident>();

  updateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private incidentService: IncidentService
  ) {
    this.updateForm = this.fb.group({
      status: ['', Validators.required],
      comment: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
      const update = {
        status: this.updateForm.value.status,
        comments: [
          ...(this.incident.comments || []),
          this.updateForm.value.comment,
        ],
        updatedAt: new Date(),
      };

      const updatedIncident = { ...this.incident, ...update };

      this.incidentService.updateIncident(this.incident.id!, update).subscribe(
        () => {
          this.incidentUpdated.emit(updatedIncident);
          this.updateForm.reset();
        },
        (error) => console.error('Error updating incident', error)
      );
    }
  }
}
