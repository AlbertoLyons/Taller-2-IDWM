import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-view-products',
  imports: [CommonModule],
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.css'
})
export class ViewProductsComponent {
  productos: any;
  paginaSiguiente() {
  throw new Error('Method not implemented.');
  }
  paginaAnterior() {
  throw new Error('Method not implemented.');
  }
  
}
