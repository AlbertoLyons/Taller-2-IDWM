import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ProductCart } from '../../interfaces/ResponseApi_cart';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdressDto, buyResponse } from '../../interfaces/ResponseApi_receipt';
import { jsPDF } from 'jspdf';  // Importamos la librería jsPDF

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
  respuestaCompra: buyResponse = { message: "", receipt: {} as any };
  calle: string = '';
  descargaFinalizada: boolean = false;
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
  async finalizePurchase(pais: string, ciudad: string, comuna: string, calle: string): Promise<void> {
    if (this.isFormValid()) {
      console.log('Compra finalizada');
      var adressDto : AdressDto = {
        country: pais,
        city: ciudad,
        county: comuna,
        address: calle
      }
      var response = await this.productServices.finalizePurchase(adressDto)
      this.respuestaCompra = response;
      this.descargaFinalizada = true;
      this.getAllProductCart();
      this.cdr.markForCheck();
      console.log(response);

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
  descargarComprobante() {
    if (!this.respuestaCompra || !this.respuestaCompra.receipt) {
      console.error('No se encontraron datos de compra');
      return;  // Detenemos el proceso si los datos no están completos
    }
    
    // Crear el documento PDF
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Receipt of Purchase', 20, 20); // Título de la boleta
    
    doc.setFontSize(12);
    let yPosition = 30; // Posición inicial para la información
    
    // Información general
    doc.text(`Message: ${this.respuestaCompra.message}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Country: ${this.respuestaCompra.receipt.country}`, 20, yPosition);
    yPosition += 10;
    doc.text(`City: ${this.respuestaCompra.receipt.city}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Address: ${this.respuestaCompra.receipt.address}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Total Price: $${this.respuestaCompra.receipt.totalPrice}`, 20, yPosition);
    yPosition += 10;
    
    // Sección de productos
    doc.text('Products:', 20, yPosition);
    yPosition += 10;
    
    // Crear tabla de productos
    const products = this.respuestaCompra.receipt.receiptProducts;
    const startX = 20;
    const startY = yPosition;
    const columnWidths = [100, 40, 30, 40]; // Anchos de las columnas para: nombre, tipo, cantidad, precio total
    
    // Dibujar encabezados
    doc.setFontSize(10);
    doc.text('Name', startX, startY);
    doc.text('Type', startX + columnWidths[0], startY);
    doc.text('Quantity', startX + columnWidths[0] + columnWidths[1], startY);
    doc.text('Total Price', startX + columnWidths[0] + columnWidths[1] + columnWidths[2], startY);
    
    yPosition += 10;
    
    // Dibujar filas de productos
    doc.setFontSize(10);
    products.forEach((product, index) => {
      const productName = doc.splitTextToSize(product.name, columnWidths[0]); // Ajustar nombre largo
      const productType = product.type;
      const productQuantity = product.quantity.toString();
      const productTotalPrice = `$${product.totalPrice}`;
    
      // Escribir el nombre del producto en múltiples líneas si es necesario
      let tempYPosition = yPosition + (index * 20);
      doc.text(productName, startX, tempYPosition);
      doc.text(productType, startX + columnWidths[0], tempYPosition);
      doc.text(productQuantity, startX + columnWidths[0] + columnWidths[1], tempYPosition);
      doc.text(productTotalPrice, startX + columnWidths[0] + columnWidths[1] + columnWidths[2], tempYPosition);
    });
    
    // Finalizar el documento PDF
    doc.save('purchase_receipt.pdf');
  }
}
