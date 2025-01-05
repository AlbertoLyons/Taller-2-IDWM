import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ProductCart } from '../../interfaces/ResponseApi_cart';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  imports: [NavbarComponent, CurrencyPipe, CommonModule, FormsModule],
  providers: [CartService],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {



  private productServices: CartService = inject(CartService);
  productsCart: ProductCart[] = [];
  totalPrice: number = 0;
  pais: string = '';
  ciudad: string = '';
  comuna: string = '';
  calle: string = '';
  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    this.getAllProductCart();
    this.cdr.markForCheck();
    console.log(this.productsCart);

  }
  async getAllProductCart(){
    this.productsCart = await this.productServices.getProductFromCart()
    .catch((error) => {
      console.log(error);
      return [];
    }) || [];
    console.log(this.productsCart);
    this.calculateTotal();
  }
  async increaseQuantity(id: number) {
    const response = await this.productServices.increaseOrDecreaseProduct(id, "add")
    .catch((error) => {
      console.log(error);
      return [];
    }) || [];
    console.log(response);
    this.getAllProductCart();
    this.calculateTotal();
  }
  async decreaseQuantity(id: number) {
    const response = await this.productServices.increaseOrDecreaseProduct(id, "decrease")
    .catch((error) => {
      console.log(error);
      return [];
    }) || [];
    console.log(response);
    this.getAllProductCart();
    this.calculateTotal();
  }
  finalizePurchase() {
    if (this.isFormValid()) {
      console.log('Compra finalizada');
      // Aquí podrías hacer la llamada al servicio para procesar la compra
    }
  }
  async removeProduct(idProducto: number) {
    const response = await this.productServices.deleteProductFromCart(idProducto)
    .catch((error) => {
      console.log(error);
      return [];
    }) || [];
    console.log(response);
    this.getAllProductCart();
    this.calculateTotal();
  }
  calculateTotal(): void {
    this.totalPrice = this.productsCart.reduce((total, product) => {
      return total + (product.price * product.quantity);  // Multiplica precio por cantidad y acumula
    }, 0);
  }
  isFormValid(): boolean {
    return this.pais.trim() !== '' && this.ciudad.trim() !== '' && this.comuna.trim() !== '' && this.calle.trim() !== '';
  }
}
