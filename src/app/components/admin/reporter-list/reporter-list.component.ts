import { Component, Input } from '@angular/core';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-reporter-list',
  templateUrl: './reporter-list.component.html',
})
export class ReporterListComponent {
  @Input() reporters: User[] = [];
}
