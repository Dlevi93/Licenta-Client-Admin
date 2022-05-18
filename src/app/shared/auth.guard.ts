import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, RouterStateSnapshot,
  CanActivate, Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';
import { User } from './models/user.model';
import { NavigationService } from './services/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public router: Router,
    private _authService: AuthService,
    private _notifyService: NotificationService,
    private _navigationService: NavigationService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this._authService.isLoggedIn !== true) {
      this._notifyService.showError('Nu ai acces la pagina dorita!', 'Eroare');
      this.router.navigate(['pages/auth/login-2']);
      return false;
    }

    let currentUser = this._authService.currentUser as User;
    if (this._authService.currentUser !== undefined) {
      return this.checkUserRole(next, currentUser);
    }

    return this._authService.getUserProfile().toPromise().then(() => {
      currentUser = this._authService.currentUser;
      return this.checkUserRole(next, currentUser);
    });
  }

  checkUserRole(next: ActivatedRouteSnapshot, currentUser: User): boolean {
    if (next.data.roles && next.data.roles.indexOf(currentUser.roles[0]) === -1) {
      this._notifyService.showError('Nu ai acces la pagina dorita!', 'Eroare!');
      const removeToken = localStorage.removeItem('access_token');
      if (removeToken == null) {
        this.router.navigate(['pages/auth/login-2']);
      }
      return false;
    }

    this._navigationService.checkNavigation(currentUser);
    return true;
  }
}
