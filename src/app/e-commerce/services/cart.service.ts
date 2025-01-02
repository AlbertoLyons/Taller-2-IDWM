import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseUrl: string = "http://localhost/api/Cart";

  private http = inject(HttpClient);

  public errors: string[] = []; 


}
