import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {

  private baseUrl: string = "http://localhost:5225/api/receipts";

  private http = inject(HttpClient);

  public errors: string[] = []; 


}
