import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ChangePageButtonsComponent } from '../../components/change-page-buttons/change-page-buttons.component';
import { Product } from '../../interfaces/ResponseApi_products';
import { ProductServices } from '../../services/products.service';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { jwtDecode } from 'jwt-decode';
import { UsersService } from '../../services/users.service';
import { InfoUserDto } from '../../interfaces/ResponseApi_users';
@Component({
  selector: 'app-view-clients',
  imports: [CommonModule, NavbarComponent, ChangePageButtonsComponent, SearchBarComponent, FormsModule],
  providers: [UsersService, CartService],
  templateUrl: './view-clients.component.html',
  styleUrl: './view-clients.component.css'
})
export class ViewClientsComponent {
habilitarCliente(arg0: number) {
throw new Error('Method not implemented.');
}
deshabilitarCliente(arg0: number) {
throw new Error('Method not implemented.');
}
  private users: UsersService = inject(UsersService);
  private productCartServices: CartService = inject(CartService);
  products: InfoUserDto[] = [];
  actualPage: number = 1;
  AscOrDesc: string = "asc";
  type: string = "Nada";
  search: string = "";
  pageChange = output<number>();
  maxPage: number = 0;
  buttonNextDisabled: boolean = false;
  buttonPreviousDisabled: boolean = true;
  message: string = '';  // Variable para almacenar el mensaje
  showMessage: boolean = false;  // Controla si el mensaje debe mostrarse o no
  isAuthenticated = false;
  userName: string | null = null;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    this.getAllProductUsers(this.AscOrDesc, this.type,  this.actualPage, this.search);
    this.getMaxPage();
    const token = localStorage.getItem('auth'); // Cambia a sessionStorage si es necesario
    console.log(token);
    if (token != null) {
      try {
        const auth = JSON.parse(token);

        this.userName = auth.name || 'Usuario'; // Cambia 'name' según el payload de tu token
        this.isAuthenticated = true;
        console.log(this.userName);
      } catch (error) {
        console.error('Error al decodificar el token', error);
        this.isAuthenticated = false;
      }

    }
  }
  async getMaxPage(){
    this.maxPage = await this.users.getMaxPage()
    .catch((error) => {
      console.log(error);
      return 0;
    }) || 0;
  }
  async getAllProductUsers(AscOrDesc:string, type : string, page: number, search: string){ {
    console.log(this.type);
    console.log(this.actualPage);
    console.log(this.AscOrDesc);
    console.log(this.search);
    this.products = await this.users.getUsers(page)
    .catch((error) => {
      console.log(error);
      return [];
    }) || [];
    console.log(this.products);

  }}
  setNewPage(page: number) {
    if (page === 1) {
      this.buttonPreviousDisabled = true;
    } else {
      this.buttonPreviousDisabled = false;
    }
    if (page === this.maxPage) {
      this.buttonNextDisabled = true;
    } else {
      this.buttonNextDisabled = false;
    }
    
    this.pageChange.emit(page);
    this.actualPage = page;
    this.getAllProductUsers(this.AscOrDesc, this.type, page, this.search);
    }
    setSearch(search: string) {
    this.search = search;
    this.getAllProductUsers(this.AscOrDesc, this.type,  this.actualPage, this.search);
    }

    navigateTo(route: string): void {
      this.router.navigate([route]);
    }
    async applyFilters() {
      this.getAllProductUsers(this.AscOrDesc, this.type,  this.actualPage, this.search);
      this.cdr.markForCheck();
    }
    logout() {
      localStorage.removeItem('auth'); // Elimina el token
      this.isAuthenticated = false;
      this.userName = '';
      this.clearCookies();
      this.navigateTo('iniciarSesion'); // Redirige al inicio de sesión
    }
    clearCookies(): void {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    }
}
