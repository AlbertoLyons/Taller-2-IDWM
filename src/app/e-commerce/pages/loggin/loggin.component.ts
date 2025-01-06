import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { LogginDto } from '../../interfaces/ResponseApi_auth'; 
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage-service.service';

@Component({
  selector: 'app-loggin',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [AuthService, LocalStorageService],
  templateUrl: './loggin.component.html',
  styleUrl: './loggin.component.css'
})
export class LogginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(Router);

  protected readonly loginForm: FormGroup = this.fb.group({
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
  protected loading = false;

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const formValue = this.loginForm.value as LogginDto;
    const loginData: LogginDto = {
      email: formValue.email.trim().toLowerCase(),
      password: formValue.password,
    };

    this.loading = true;
    
    this.authService.loggin(loginData).subscribe({
      next: (response) => {
        if (response) {
          if (response.token) {
            this.localStorageService.setVariable('token', response.token);
            this.localStorageService.setVariable('user', JSON.stringify(response));
            const roles = Array.isArray(response.roles) ? response.roles : [response.roles];
            console.log(roles);
          
            if (roles.includes("Admin")) {
              this.navigate('view-products-admin');
            } else {
              this.navigate('home');
              console.log('Logged in successfully');
            }
            this.loading = false;
            
          }
        } else {
          this.loading = false;
          console.log('Error on login', response);

        }
      },
      error: (error) => {
        this.loading = false;
        let e = this.authService.errors;
        console.log('Error', e);
      },
    });
  }

  private alphanumericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const regex = /^[a-zA-Z0-9]*$/;
      return regex.test(control.value) ? null : { alphanumeric: true };
    };
  }
  navigate(route: string) {
    this.router.navigate([route]);
  }
  protected getFieldError(fieldName: keyof LogginDto): string {
    const control = this.loginForm.get(fieldName);

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
}

