import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      if (
        route.data['roles'] &&
        route.data['roles'].indexOf(currentUser.role) === -1
      ) {
        // Role not authorized -> redirect to home page
        this.router.navigate(['/']);
        return false;
      }

      // For reporter routes, checking if the ID in route= current user's ID
      if (
        currentUser.role === 'reporter' &&
        route.params['id'] !== currentUser.id
      ) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }

    // Not logged -> redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
