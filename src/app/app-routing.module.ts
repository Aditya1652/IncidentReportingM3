import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { ReporterDashboardComponent } from './components/reporter/reporter-dashboard/reporter-dashboard.component';
import { LoginComponent } from './components/shared/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminRegistrationComponent } from './components/admin/admin-registration/admin-registration.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
  },
  { path: 'admin-registration', component: AdminRegistrationComponent },
  {
    path: 'reporter/:id',
    component: ReporterDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['reporter'] },
  },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
