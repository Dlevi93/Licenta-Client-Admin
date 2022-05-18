import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private _authService: AuthService,
        private _notifyService: NotificationService,
        private _fuseProgressBarService: FuseProgressBarService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].indexOf(err.status) !== -1) {
                this.loginFailed();

                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                this._authService.doLogout();
                // location.reload(true);
            }
            const error = err.error || err.statusText;
            return throwError(error);
        }));
    }

    loginFailed() {
        this._notifyService.showWarning('Hibás felhasználónév vagy jelszó!', 'Hiba a bejelentkezés során!');
        this._fuseProgressBarService.hide();
    }
}
