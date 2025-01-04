import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

@Component({
  selector: 'app-view-products-admin',
  imports: [
    NavbarComponent,
    SearchBarComponent],
  templateUrl: './view-products-admin.component.html',
  styleUrl: './view-products-admin.component.css'
})
export class ViewProductsAdminComponent {

}
