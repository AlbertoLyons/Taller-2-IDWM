import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, 
  FormBuilder, 
  FormGroup,
  ReactiveFormsModule, 
  ValidationErrors, 
  ValidatorFn, 
  Validators } from '@angular/forms';
import { RegisterDto } from '../../interfaces/ResponsiveApi_register';
@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,],
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
    private readonly fb = inject(FormBuilder);
  protected readonly registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        this.alphanumericValidator(),
      ],
    ],
  });
  constructor() { }
  protected onSubmit(): void {
    console.log('RegisterFormComponent.onSubmit()');
  }
  protected getFieldError(fieldName: keyof RegisterDto): string {
    const control = this.registerForm.get(fieldName);

    if (!control || !control.errors || !control.touched) return '';

    const errors = {
      required: 'Este campo es requerido',
      email: 'Correo electrónico inválido',
      minlength: `Mínimo ${control.errors['minlength']?.requiredLength} caracteres`,
      maxlength: `Máximo ${control.errors['maxlength']?.requiredLength} caracteres`,
      alphanumeric: 'Solo se permiten letras y números',
    };

    const firstError = Object.keys(control.errors)[0];
    return errors[firstError as keyof typeof errors] || 'Campo inválido';
  }
  private alphanumericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const regex = /^[a-zA-Z0-9]*$/;
      return regex.test(control.value) ? null : { alphanumeric: true };
    };
  }
}

