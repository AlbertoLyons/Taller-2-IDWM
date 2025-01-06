import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { InfoUserDto, responseEdit, ResponseGetAllUsers, updatePassword, updateProfile } from '../interfaces/ResponseApi_users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl: string = "http://localhost:5225/api/user";

  private http = inject(HttpClient);

  public errors: string[] = []; 

  async InfoUser(id: number): Promise<InfoUserDto> {
    try {
      const authString = localStorage.getItem('auth');

      if (authString == null) {
        return Promise.reject("No hay token");
      }
        // Convertir el string JSON a un objeto
        const auth = JSON.parse(authString);
      
        // Obtener el token
        const token = auth.token;
      
      
      const params = new HttpParams().set('id', id.toString()); // Asegúrate de que `id` sea una cadena
      console.log('Parametros:', params.toString()); // Verificar cómo se serializan los parámetros
      const response = await firstValueFrom(
        this.http.get<InfoUserDto>(`${this.baseUrl}/GetById`, { 
          params,
          withCredentials: true, 
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          },
        })
      );
      console.log('Respuesta:', response);
      return response; // Devolver la respuesta
    } catch (error) {
      console.log("Error en InfoUser", error);
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      throw error; // Lanza el error para que pueda ser manejado
    }
  }
  async EditUserProfile(info: updateProfile): Promise<boolean> {
    try {
      const authString = localStorage.getItem('auth');

      if (authString == null) {
        return Promise.reject("No hay token");
      }
        // Convertir el string JSON a un objeto
        const auth = JSON.parse(authString);
      
        // Obtener el token
        const token = auth.token;
      
      
      const params = new HttpParams().set('id', auth.id.toString()); // Asegúrate de que `id` sea una cadena
      console.log('Parametros:', params.toString()); // Verificar cómo se serializan los parámetros
      const response = await firstValueFrom(
        this.http.put<boolean>(`${this.baseUrl}/${auth.id}/profile`, info, { 
          withCredentials: true, 
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          },
        })
      );
      console.log('Respuesta:', response);
      return true; // Devolver la respuesta
    } catch (error) {
      console.log("Error en InfoUser", error);
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return false;
    }
  }
  async EditUserPassword(info : updatePassword): Promise<boolean> {
    try {
      const authString = localStorage.getItem('auth');

      if (authString == null) {
        return Promise.reject("No hay token");
      }
        // Convertir el string JSON a un objeto
        const auth = JSON.parse(authString);
      
        // Obtener el token
        const token = auth.token;
      
      
      const params = new HttpParams().set('id', auth.id.toString()); // Asegúrate de que `id` sea una cadena
      console.log('Parametros:', params.toString()); // Verificar cómo se serializan los parámetros
      const response = await firstValueFrom(
        this.http.put<boolean>(`${this.baseUrl}/${auth.id}/password`, info, { 
          withCredentials: true, 
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          },
        })
      );
      console.log('Respuesta:', response);
      return true; // Devolver la respuesta
    } catch (error) {
      console.log("Error en InfoUser", error);
      let e = error as HttpErrorResponse;
      this.errors.push(e.message);
      return false;
    }
  }
    async getUsers(pageNumber: number): Promise<InfoUserDto[]> {
      try{
        const authString = localStorage.getItem('auth');

        if (authString == null) {
          return Promise.reject("No hay token");
        }
          // Convertir el string JSON a un objeto
          const auth = JSON.parse(authString);
        
          // Obtener el token
          const token = auth.token;
        console.log("token: ",token);

        
        const params = new HttpParams().set("pageNumber", pageNumber)
        const response = await firstValueFrom(this.http.get<ResponseGetAllUsers>(`${this.baseUrl}/GetAll?pagenumber=${pageNumber}`, { 
          withCredentials: true, 
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          },
        }));
        return Promise.resolve(response.users);
      }catch(error){
        console.log("Error en getProductsUsers",error)
        let e = error as HttpErrorResponse;
        this.errors.push(e.message);
        return Promise.reject(error);
      }
    }
    async getMaxPage(): Promise<number> {
      try{
        const authString = localStorage.getItem('auth');

        if (authString == null) {
          return Promise.reject("No hay token");
        }
          // Convertir el string JSON a un objeto
          const auth = JSON.parse(authString);
        
          // Obtener el token
          const token = auth.token;
        console.log("token: ",token);

        
        const response = await firstValueFrom(this.http.get<ResponseGetAllUsers>(`${this.baseUrl}/GetAll?pagenumber=1`,{
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
          },
        }));
        return Promise.resolve(response.totalPages);
      }catch(error){
        console.log("Error en getProductsUsers",error)
        let e = error as HttpErrorResponse;
        this.errors.push(e.message);
        return Promise.reject(error);
      }
    }
}  
