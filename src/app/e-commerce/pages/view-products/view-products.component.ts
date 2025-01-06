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

@Component({
  selector: 'app-view-products',
  imports: [CommonModule, NavbarComponent, ChangePageButtonsComponent, SearchBarComponent, FormsModule],
  providers: [ProductServices, CartService],
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.css'
})
export class ViewProductsComponent {


 
  private productServices: ProductServices = inject(ProductServices);
  private productCartServices: CartService = inject(CartService);
  products: Product[] = [];
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
    this.maxPage = await this.productServices.getMaxPage()
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
    this.products = await this.productServices.getProductsUsers(AscOrDesc, type, search, page)
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
    async agregarAlCarrito(id: number) {
      console.log(`Producto con ID ${id} agregado al carrito`);
      
      try {
        const response = await this.productCartServices.AddProductToCart(id);
        
        this.message = response;  // Asignar el mensaje de la respuesta
        this.showMessage = true;  // Hacer visible el mensaje
        
        setTimeout(() => {
          this.showMessage = false;
        }, 3000);  // 3000 ms = 3 segundos
      } catch (error) {
        console.log('Error:', error);
        this.message = 'Hubo un problema al agregar el producto al carrito';
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
        }, 3000);
      }
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