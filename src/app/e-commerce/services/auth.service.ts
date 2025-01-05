import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LogginDto, Auth } from '../interfaces/ResponseApi_auth'; 
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = "http://localhost:5225/api/Auth";

  private http = inject(HttpClient);

  public errors: string[] = []; 

  private currentAuthSubject = new BehaviorSubject<Auth | null>(null);
  public currentAuth$ = this.currentAuthSubject.asObservable();

  constructor() {
    this.initializeAuth();
  }

  loggin(credentials: LogginDto): Observable<Auth> {
    return this.http.post<Auth>(`${this.baseUrl}/login`, credentials).pipe(
      map((auth) => {
        this.handleSuccessfulAuth(auth);
        console.log(auth);
        return auth;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth');
    this.clearAuthState();
  }

  getCurrentAuth(): Auth | null {
    return this.currentAuthSubject.value;
  }

  setCurrentAuth(auth: Auth): void {
    localStorage.setItem('auth', JSON.stringify(auth));
    this.currentAuthSubject.next(auth);
  }

  isAuthInitialized(): boolean {
    return this.currentAuthSubject.value !== null;
  }

  isAuthenticated(): boolean {
    return this.currentAuthSubject.value !== null;
  }

  // Private methods
  private initializeAuth(): void {
    const item = localStorage.getItem('auth');
    if (!item) return;

    try {
      const storedAuth: Auth = JSON.parse(item);
      if (storedAuth) {
        this.handleSuccessfulAuth(storedAuth);
      }
    } catch (error) {
      console.error(`Error parsing stored item for 'auth':`, error);
    }
  }

  private handleSuccessfulAuth(auth: Auth): void {
    localStorage.setItem('auth', JSON.stringify(auth));
    this.currentAuthSubject.next(auth);
  }

  private clearAuthState(): void {
    this.currentAuthSubject.next(null);
  }
}
