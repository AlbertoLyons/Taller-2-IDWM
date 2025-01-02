import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ChangePageButtonsComponent } from '../../components/change-page-buttons/change-page-buttons.component';
import { Product } from '../../interfaces/ResponseApi_products';
import { ProductServices } from '../../services/products.service';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

@Component({
  selector: 'app-view-products',
  imports: [CommonModule, NavbarComponent, ChangePageButtonsComponent, SearchBarComponent],
  providers: [ProductServices],
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.css'
})
export class ViewProductsComponent {


 
  private productServices: ProductServices = inject(ProductServices);
  products: Product[] = [];
  actualPage: number = 1;
  order: string = "asc";
  
  pageChange = output<number>();
  maxPage: number = 0;
  buttonNextDisabled: boolean = false;
  buttonPreviousDisabled: boolean = true;

  constructor() {
    this.getAllProductUsers(this.order, this.actualPage);
    this.getMaxPage();
  }
  async getMaxPage(){
    this.maxPage = await this.productServices.getMaxPage()
    .catch((error) => {
      console.log(error);
      return 0;
    }) || 0;
  }
  async getAllProductUsers(AscOrDesc:string, page: number) {
    this.products = await this.productServices.getProductsUsers(AscOrDesc, page)
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
    this.getAllProductUsers(this.order, page);
    }
    setSearch($event: Event) {
      throw new Error('Method not implemented.');
      }
}
