import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-change-page-buttons',
  imports: [],
  templateUrl: './change-page-buttons.component.html',
  styleUrl: './change-page-buttons.component.css'
})
export class ChangePageButtonsComponent {
  
  @Input() page: number = 1;
  @Input() maxPage: number = 0;
  @Output() notifyParent = new EventEmitter<number>();
  @Input() buttonNextDisabled: boolean = false;
  @Input() buttonPreviousDisabled: boolean = false;
    
  
  
  
  paginaSiguiente() {
    this.page++;
    this.notifyParent.emit(this.page);
  }
  paginaAnterior() {
    this.page--;
    this.notifyParent.emit(this.page);
  }
}
