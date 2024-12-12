import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiKey = 'AIzaSyBo76K_sDnjni7VrpRq19JvHjLXHCov8xA'; //Firebase Key
  private dbUrl =
    'https://incident-reporting-6cd82-default-rtdb.firebaseio.com'; //Firebase Database Link

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  signup(
    name: string,
    email: string,
    password: string,
    isAdmin: boolean = false
  ): Observable<User> {
    return this.http
      .post<any>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        switchMap(
          (response) => this.handleAuthentication(response, isAdmin, name) // Pass name to handleAuthentication
        ),
        catchError(this.handleError)
      );
  }

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<any>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        switchMap((response) => this.handleLoginAuthentication(response)),
        catchError(this.handleError)
      );
  }

  private handleAuthentication(
    response: any,
    isAdmin: boolean = false,
    name: string
  ): Observable<User> {
    const expirationDate = new Date(
      new Date().getTime() + +response.expiresIn * 1000
    );
    const user: User = {
      id: response.localId,
      name: name,
      email: response.email,
      token: response.idToken,
      expirationDate: expirationDate,
      role: isAdmin ? 'admin' : 'reporter',
    };

    return this.saveUserData(user).pipe(
      tap((updatedUser) => {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
        this.setLogoutTimer(+response.expiresIn * 1000);
      })
    );
  }

  private handleLoginAuthentication(response: any): Observable<User> {
    const expirationDate = new Date(
      new Date().getTime() + +response.expiresIn * 1000
    );
    return this.getUserRole(response.localId).pipe(
      map((role: 'admin' | 'reporter') => {
        const user: User = {
          id: response.localId,
          email: response.email,
          token: response.idToken,
          expirationDate: expirationDate,
          role: role,
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.setLogoutTimer(+response.expiresIn * 1000);
        return user;
      })
    );
  }

  private getUserRole(userId: string): Observable<string> {
    return this.http
      .get<{ role: string }>(`${this.dbUrl}/users/${userId}.json`)
      .pipe(
        map((userData) =>
          userData && userData.role ? userData.role : 'reporter'
        ),
        catchError(() => of('reporter'))
      );
  }

  private saveUserData(user: User): Observable<User> {
    return this.http
      .put<void>(`${this.dbUrl}/users/${user.id}.json?auth=${user.token}`, {
        name: user.name,
        role: user.role,
      })
      .pipe(
        map(() => user),
        catchError((error) => {
          console.error('Error saving user data:', error);
          return throwError(error);
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  private setLogoutTimer(expirationDuration: number) {
    setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  getAllUsers(): Observable<User[]> {
    const token = this.currentUserValue?.token;

    if (!token) {
      return throwError('No authentication token available');
    }

    return this.http
      .get<{ [key: string]: User }>(`${this.dbUrl}/users.json?auth=${token}`)
      .pipe(
        map((users) => {
          const userArray: User[] = [];
          if (users) {
            for (const key in users) {
              if (users.hasOwnProperty(key)) {
                userArray.push({
                  ...users[key],
                  id: key,
                  name: users[key]?.name,
                });
              }
            }
          }
          return userArray;
        }),
        catchError((error) => {
          console.error('Error fetching users:', error);
          return throwError('Failed to fetch users');
        })
      );
  }

  private handleError(errorRes: any) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }

  getUserDetails(uid: string): Observable<User> {
    const token = this.currentUserValue?.token;

    if (!token) {
      return throwError('No authentication token available');
    }

    return this.http
      .get<User>(`${this.dbUrl}/users/${uid}.json?auth=${token}`)
      .pipe(
        map((user) => ({
          ...user,
          id: uid,
          displayName: user.name,
        })),
        catchError((error) => {
          console.error(`Error fetching user details for ID ${uid}:`, error);
          return throwError('Failed to fetch user details');
        })
      );
  }
}
