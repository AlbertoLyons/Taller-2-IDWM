import { Component, inject, output } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { ChangePageButtonsComponent } from "../../components/change-page-buttons/change-page-buttons.component";
import { HttpClientModule } from '@angular/common/http';
import { ProductServices } from '../../services/products.service';
import { Product } from '../../interfaces/ResponseApi_products';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-products-admin',
  imports: [
    CommonModule,
    NavbarComponent,
    SearchBarComponent,
    ChangePageButtonsComponent,
    HttpClientModule
],
  providers: [ProductServices],
  templateUrl: './view-products-admin.component.html',
  styleUrl: './view-products-admin.component.css'
})
export class ViewProductsAdminComponent {

  private productServices: ProductServices = inject(ProductServices);
  products: Product[] = [];
  actualPage: number = 1;
  order: string = "asc";
  type: string = "Nada";
  search: string = "";

  pageChange = output<number>();
  maxPage: number = 0;
  buttonNextDisabled: boolean = false;
  buttonPreviousDisabled: boolean = true;

  constructor(private router: Router) {
    this.getAllProductUsers(this.order, this.type, this.search, this.actualPage);
    this.getMaxPage();
  }

  async getMaxPage(){
    this.maxPage = await this.productServices.getMaxPage()
    .catch((error) => {
      console.log(error);
      return 0;
    }) || 0;
  }

  async getAllProductUsers(AscOrDesc:string, type : string, search : string, page: number) {
    this.products = await this.productServices.getProductsUsers(AscOrDesc, type, search, page)
    .catch((error) => {
      console.log(error);
      return [];
    }) || [];
  }

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
    this.getAllProductUsers(this.order, this.type, this.search, page);
  }

  setSearch(search: string) {
    this.search = search;
    this.getAllProductUsers(this.order, this.type,  this.search, this.actualPage);
  }
}
