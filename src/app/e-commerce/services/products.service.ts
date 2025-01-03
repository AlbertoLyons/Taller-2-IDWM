import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Product, ResponseAPIGetAllProducts } from '../interfaces/ResponseApi_products';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductServices {

  private baseUrl: string = "http://localhost:5225/api/products";

  private http = inject(HttpClient);

  public errors: string[] = []; 

  async getProductsUsers(AscOrDesc:string, type:string, pageNumber: number): Promise<Product[]> {
    try{
      const params = new HttpParams().set('AscOrDesc', AscOrDesc).set("pageNumber", pageNumber).set("type", "Nada");
      const response = await firstValueFrom(this.http.get<ResponseAPIGetAllProducts>(`${this.baseUrl}/GetAll`, {params}));
      return Promise.resolve(response.products);
    }catch(error){
      console.log("Error en getProductsUsers",error)
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(error);
    }
  }
  async getMaxPage(): Promise<number> {
    try{
      const params = new HttpParams().set('AscOrDesc', "asc").set("pageNumber", 1).set("type", "Nada");
      const response = await firstValueFrom(this.http.get<ResponseAPIGetAllProducts>(`${this.baseUrl}/GetAll`, {params}));
      return Promise.resolve(response.totalPages);
    }catch(error){
      console.log("Error en getProductsUsers",error)
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(error);
    }
  }
}
