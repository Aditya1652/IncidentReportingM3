import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { IncidentAssignmentComponent } from './components/admin/incident-assignment/incident-assignment.component';
import { ReporterListComponent } from './components/admin/reporter-list/reporter-list.component';
import { IncidentUpdateComponent } from './components/reporter/incident-update/incident-update.component';
import { ReporterDashboardComponent } from './components/reporter/reporter-dashboard/reporter-dashboard.component';
import { IncidentListComponent } from './components/shared/incident-list/incident-list.component';
import { LoginComponent } from './components/shared/login/login.component';
import { IncidentFilterPipe } from './pipes/incident-filter.pipe';
import { AuthService } from './services/auth.service';
import { IncidentService } from './services/incident.service';
import { AdminRegistrationComponent } from './components/admin/admin-registration/admin-registration.component';
import { AdminRegistrationLinkComponent } from './components/shared/admin-registration-link/admin-registration-link.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminDashboardComponent,
    IncidentAssignmentComponent,
    ReporterListComponent,
    IncidentUpdateComponent,
    ReporterDashboardComponent,
    IncidentListComponent,
    LoginComponent,
    IncidentFilterPipe,
    AdminRegistrationComponent,
    AdminRegistrationLinkComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [AuthService, IncidentService],
  bootstrap: [AppComponent],
})
export class AppModule {}
