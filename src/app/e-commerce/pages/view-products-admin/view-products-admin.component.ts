import { ChangeDetectorRef, Component, inject, output } from '@angular/core';
import { ProductAdminComponent } from '../../components/product-admin/product-admin.component'; 
import { AuthService } from '../../services/auth.service';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { ProductServices } from '../../services/products.service';
import { Product } from '../../interfaces/ResponseApi_products';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChangePageButtonsComponent } from '../../components/change-page-buttons/change-page-buttons.component';
@Component({
  selector: 'app-view-products-admin',
  imports: [ProductAdminComponent,CommonModule,NavbarComponent,SearchBarComponent, FormsModule, ChangePageButtonsComponent],
  providers: [AuthService, LocalStorageService],
  templateUrl: './view-products-admin.component.html',
  styleUrl: './view-products-admin.component.css'
})
export class ViewProductsAdminComponent {
  private readonly authService = inject(AuthService);
  private readonly LLService = inject(LocalStorageService);
  private readonly productService = inject(ProductServices);
  private readonly router = inject(Router);
  protected showMessage = false;
  maxPage: number = 0;
  buttonNextDisabled: boolean = false;
  buttonPreviousDisabled: boolean = true;
  type: string = '';
  AscOrDesc: string = 'Asc';
  search: string = "";
  pageChange = output<number>();
  message = '';
  actualPage: number = 1;
  products: Product[] = [];
  constructor(private cdr: ChangeDetectorRef) {
  }
  async ngOnInit(): Promise<void> {
    await this.getProducts("asc", "Nada", "", 1);
  }
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
  async getProducts(AscOrDesc:string, type:string, search: string, pageNumber: number): Promise<void> {
    this.products = await this.productService.getProductsUsers(AscOrDesc, type, search, pageNumber);
    console.log('Products', this.products); 
  }
  setSearch(search: string): void {
    this.search = search;
    console.log('Search', this.search);
    this.getProducts(this.AscOrDesc, this.type, this.search, this.actualPage,);
  }
  applyFilters(): void {
    this.getProducts(this.AscOrDesc, this.type, this.search, this.actualPage,);
    this.cdr.markForCheck();
  }
  setNewPage(page: number): void {
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
    this.getProducts(this.AscOrDesc, this.type, this.search, page);
  }
}
