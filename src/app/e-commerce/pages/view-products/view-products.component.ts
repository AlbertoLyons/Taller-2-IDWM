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

@Component({
  selector: 'app-view-products',
  imports: [CommonModule, NavbarComponent, ChangePageButtonsComponent, SearchBarComponent, FormsModule],
  providers: [ProductServices],
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.css'
})
export class ViewProductsComponent {
 
  private productServices: ProductServices = inject(ProductServices);
  products: Product[] = [];
  actualPage: number = 1;
  AscOrDesc: string = "asc";
  type: string = "Nada";
  search: string = "";
  pageChange = output<number>();
  maxPage: number = 0;
  buttonNextDisabled: boolean = false;
  buttonPreviousDisabled: boolean = true;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    this.getAllProductUsers(this.AscOrDesc, this.type,  this.actualPage, this.search);
    this.getMaxPage();
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
    agregarAlCarrito(id: number) {
      console.log(`Producto con ID ${id} agregado al carrito`);
      // Aquí puedes agregar la lógica para añadir el producto al carrito, por ejemplo:
      // this.cartService.addToCart(id);
  }
}
