import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ProductServices } from '../../services/products.service';
import { addEditProduct } from '../../interfaces/add-edit-product';
import { NgxDropzoneModule } from 'ngx-dropzone';
@Component({
  selector: 'app-product-admin',
  imports: [CommonModule,ReactiveFormsModule,NgxDropzoneModule],
  templateUrl: './product-admin.component.html',
  styleUrl: './product-admin.component.css'
})
export class ProductAdminComponent {
  private readonly fb = inject(FormBuilder);
  private readonly productServices = inject(ProductServices);
  protected readonly editForm: FormGroup = this.fb.group({
  name: ['', [Validators.required,]],
  type: ['', [Validators.required,]],
  stock: ['', [Validators.required,]],
  price: ['', [Validators.required,]],
  });
  protected loading = false;
  deleteIsVisible: boolean = false;
  editIsVisible: boolean = false;
  @Input() id: number = 0;
  @Input() imageUrl: string = '';
  @Input() name: string = '';
  @Input() type: string = '';
  @Input() stock: number = 0;
  @Input() price: number = 0;
  files: File[] = [];
  onSubmit() {
    if (this.editForm.invalid) {
      return;
    }
    this.loading = true;
    const product: addEditProduct = {
      name: this.editForm.get('name')?.value,
      type: this.editForm.get('type')?.value,
      price: this.editForm.get('price')?.value,
      stock: this.editForm.get('stock')?.value,
      image: this.files[0]
    };
    console.log('Form data', product);
    this.productServices.updateProduct(this.editForm.get('id')?.value, product).then((response) => {
      console.log('Product updated successfully', response);
      this.loading = false;
      window.location.reload();
    }).catch((error) => {
      console.error('Error updating product', error);
      this.loading = false;
    });
  }
  onSelect(event: any) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  openModal(buttonType: string) {
    if (buttonType === 'edit') {
      this.editIsVisible = true;
    } else {
      this.deleteIsVisible = true;
    }
  }
  cancel(buttonType: string) {
    if (buttonType === 'edit') {
      this.editIsVisible = false;
    } else {
      this.deleteIsVisible = false;

    }
  }
  
  confirm(buttonType: string) {
    if (buttonType === 'edit') {
      this.editIsVisible = false;
    } else {
      this.productServices.deleteProduct(this.id);
      window.location.reload();
      this.deleteIsVisible = false;
    }
  }
  protected getFieldError(fieldName: string): string {
    const control = this.editForm.get(fieldName);

    if (!control || !control.errors || !control.touched) return '';

    const errors = {
      required: 'Este campo es requerido',
      name: 'Nombre inválido. Debe de tener entre 8 y 255 caracteres',
      minlength: `Mínimo ${control.errors['minlength']?.requiredLength} caracteres`,
      maxlength: `Máximo ${control.errors['maxlength']?.requiredLength} caracteres`,
    };

    const firstError = Object.keys(control.errors)[0];
    return errors[firstError as keyof typeof errors] || 'Campo inválido';
  }
}
