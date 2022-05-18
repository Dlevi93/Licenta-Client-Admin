import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { environment } from 'environments/environment';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser: User;

  constructor(
    private http: HttpClient,
    public router: Router,
    private _navigationService: NavigationService
  ) {
  }

  // Sign-up
  signUp(user: User): Observable<any> {
    const api = `${environment.apiUrl}/register-user`;
    return this.http.post(api, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  signIn(user: User): Promise<any> {
    return new Promise((reject) => {
      this.http.post<any>(`${environment.apiUrl}/login`, user)
        .subscribe((response: any) => {
          localStorage.setItem('access_token', response.token);
          this.getUserProfile().subscribe(() => {
            this.router.navigate(['/']);
          });
          reject(response);
        }, err => {
          reject(err);
        })
      catchError(err => of(err))
    });
  }

  // tslint:disable-next-line:typedef
  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    const authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  // tslint:disable-next-line:typedef
  doLogout() {
    const removeToken = localStorage.removeItem('access_token');
    this.currentUser = null;
    if (removeToken == null) {
      this.router.navigate(['pages/auth/login-2']);
    }
  }

  // User profile
  getUserProfile(): Observable<boolean> {
    let api = `${environment.apiUrl}/getUser`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res: User) => {
        this.currentUser = res;
        return true;
      }),
      catchError((this.handleError))
    );
  }

  forgotPassword(val: any): Observable<any> {
    return of(Observable);
  }

  // Error 
  // tslint:disable-next-line:typedef
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    const removeToken = localStorage.removeItem('access_token');
    this.currentUser = null;
    if (removeToken == null) {
      this.router.navigate(['pages/auth/login-2']);
    }
    
    return throwError(msg);
  }

  changePassword(data: any) {
    return new Promise((resolve, reject) => {
      this.http.patch(`${environment.apiUrl}/changepassword`, data)
        .subscribe((response: User) => {
          resolve(response);
        }, err => {
          reject(err);
        });
    });
  }
}
