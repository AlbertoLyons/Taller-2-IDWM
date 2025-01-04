import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl: string = "http://localhost/api/users";

  private http = inject(HttpClient);

  public errors: string[] = []; 


}
