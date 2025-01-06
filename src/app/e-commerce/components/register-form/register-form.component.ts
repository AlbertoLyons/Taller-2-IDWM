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
import { AuthService } from '../../services/auth.service';
import { LocalStorageService } from '../../services/local-storage-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,],
  providers: [AuthService, LocalStorageService],
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);
  protected readonly registerForm: FormGroup = this.fb.group({
    rut: ['', [Validators.required, Validators.pattern(/^[0-9]+[-|‐]{1}[0-9kK]{1}$/)]],
    name: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
    birthdate: ['', [Validators.required, this.dateValidator()]],
    mail: ['', [Validators.required, Validators.email]],
    gender: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), this.alphanumericValidator(),],],
    confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), this.confirmPasswordValidator(), this.alphanumericValidator(),]],
  });
  protected loading = false;
  protected onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    const formValue = this.registerForm.value as RegisterDto;
    const registerData: RegisterDto = {
      rut: formValue.rut,
      birthdate: formValue.birthdate,
      mail: formValue.mail.trim().toLowerCase(),
      name: formValue.name,
      gender: formValue.gender,
      password: formValue.password,
      confirmPassword: formValue.confirmPassword,
    };
    this.loading = true;
    console.log('Register data', registerData);
    this.authService.register(registerData).subscribe({
      next: (response) => {
        if (response) {
          console.log('Response', response);
          if (response.token) {
            this.localStorageService.setVariable('token', response.token);
            this.localStorageService.setVariable('user', JSON.stringify(response));
            this.router.navigate(['home']);
            this.loading = false;
          }
        } else {
          this.loading = false;
          console.log('Error on register', response);
        }
      },
      error: (error) => {
        this.loading = false;
        let e = this.authService.errors;
        console.log('Error', e);
      },
    });
  }
  protected getFieldError(fieldName: keyof RegisterDto): string {
    const control = this.registerForm.get(fieldName);

    if (!control || !control.errors || !control.touched) return '';

    const errors = {
      required: 'Este campo es requerido',
      pattern: 'Rut inválido',
      name: 'Nombre inválido. Debe de tener entre 8 y 255 caracteres',
      email: 'Correo electrónico inválido',
      minlength: `Mínimo ${control.errors['minlength']?.requiredLength} caracteres`,
      maxlength: `Máximo ${control.errors['maxlength']?.requiredLength} caracteres`,
      alphanumeric: 'Solo se permiten letras y números',
      confirmPassword: 'Las contraseñas no coinciden',
      date: 'La fecha no puede ser mayor a la fecha actual',
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
  confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const password = this.registerForm.get('password')?.value;
      return control.value === password ? null : { confirmPassword: true };
    }
  }
  dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const date = new Date(control.value);
      const now = new Date();
      return date < now ? null : { date: true };
    }
  }
}

