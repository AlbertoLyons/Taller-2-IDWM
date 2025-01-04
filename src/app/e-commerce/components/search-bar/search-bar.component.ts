import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
    @Output() notifyParent = new EventEmitter<string>();
    search: string = "";

  searchProducts() {
    console.log("buscar: ",this.search);
      this.notifyParent.emit(this.search);
  }

}
