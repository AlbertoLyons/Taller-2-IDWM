import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ProductCart } from '../interfaces/ResponseApi_cart';
import { AdressDto, buyResponse } from '../interfaces/ResponseApi_receipt';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseUrl: string = "http://localhost:5225/api/Cart";

  private http = inject(HttpClient);

  public errors: string[] = []; 

    async AddProductToCart(idProducto:number) : Promise<string> {
      try{
        console.log("idProducto: ",idProducto)
        const response = await firstValueFrom(
          this.http.post<string>(`${this.baseUrl}/${idProducto}`, null, { 
            withCredentials: true, 
            responseType: 'text' as 'json' // Indica que la respuesta es texto.
          })
        );
        console.log(response); // Esto imprimirá: "Product added to cart"
        
        return Promise.resolve(response);
      }catch(error){
        console.log("Error en getProductsUsers",error)
        let e = error as HttpErrorResponse;
        this.errors.push(e.message);
        return Promise.reject(error);
      }
    }

  async getProductFromCart(): Promise<ProductCart[]> {
    try {

      const response = await firstValueFrom(this.http.get<ProductCart[]>(`${this.baseUrl}`, { withCredentials: true }));

      return Promise.resolve(response);
    } catch (error) {
      console.log("Error en getProductsUsers", error);
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(error);
    }
  }

  async increaseOrDecreaseProduct(idProducto:number, AddOrDecrease: string) : Promise<string> {
    try{
      console.log("idProducto: ",idProducto)
      const params = new HttpParams().set('addOrDecrease', AddOrDecrease);
      const response = await firstValueFrom(
        this.http.put<string>(`${this.baseUrl}/${idProducto}`, null, { 
          withCredentials: true, 
          responseType: 'text' as 'json',
          params // Indica que la respuesta es texto.
        })
      );
      console.log(response); // Esto imprimirá: "Product added to cart"
      
      return Promise.resolve(response);
    }catch(error){
      console.log("Error en getProductsUsers",error)
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(error);
    }
  }

  async deleteProductFromCart(idProducto:number) : Promise<string> {
    try{
      console.log("idProducto: ",idProducto)
      const response = await firstValueFrom(
        this.http.delete<string>(`${this.baseUrl}/${idProducto}`, { 
          withCredentials: true, 
          responseType: 'text' as 'json' // Indica que la respuesta es texto.
        })
      );
      console.log(response); // Esto imprimirá: "Product added to cart"
      
      return Promise.resolve(response);
    }catch(error){
      console.log("Error en getProductsUsers",error)
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(error);
    }
  }
  async finalizePurchase(adressDto: AdressDto): Promise<buyResponse> {
    try {
      console.log("AdressDto: ", adressDto);
  
      const authString = localStorage.getItem('auth');

      if (authString == null) {
        return Promise.reject("No hay token");
      }
        // Convertir el string JSON a un objeto
        const auth = JSON.parse(authString);
      
        // Obtener el token
        const token = auth.token;
      
      
        // Usar el token (por ejemplo, para un encabezado de autorización)
      console.log("Token: ", token);
      const response = await firstValueFrom(
        this.http.post<buyResponse>(`${this.baseUrl}/buy`, adressDto, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          },
        })
      );
  
      console.log(response); // Esto imprimirá: "Product added to cart"
    
      return Promise.resolve(response);
    
    } catch (error) {
      console.log("Error en finalizePurchase", error);
      const e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return Promise.reject(error);
    }
  }
  



}
