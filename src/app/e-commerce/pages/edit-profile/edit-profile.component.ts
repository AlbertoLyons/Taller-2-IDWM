import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { dateFormatValidator } from '../../validators/dateFormatValidator';
import { genderValidator } from '../../validators/genderValidator';
import { Router } from '@angular/router';
import { updatePassword, updateProfile } from '../../interfaces/ResponseApi_users';

@Component({
  selector: 'app-edit-profile',
  imports: [NavbarComponent, CommonModule, HttpClientModule, ReactiveFormsModule],
    providers: [UsersService],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {

  private readonly fb = inject(FormBuilder);
    private readonly userServices = inject(UsersService);
  
  isAuthenticated = false;
  nombrePlaceholder: string = 'Nombre actual';
  fechaPlaceholder: string = 'Fecha actual';
  generoPlaceholder: string = 'Género actual';
  successMessage: string | null = null;
  errorMessage: string | null = null; 

  protected readonly editUserForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.minLength(8), Validators.maxLength(255)] ],
    fecha: ['',[dateFormatValidator()]],
    genero: ['',[genderValidator()]]
  });
  protected readonly passwordForm: FormGroup = this.fb.group({
    actual: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
    nueva: ['',[Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
    confirmar: ['',[Validators.required, Validators.minLength(8), Validators.maxLength(20)]]
  });

  constructor(private router: Router) { 
  
  this.actualizarPlaceholders();
  
  }



  async onSubmit() {
    if (this.editUserForm.valid) {
      console.log("actualizar perfil");
    } else {
      console.log('Formulario no válido');
    }
    const userInfo: updateProfile = {
      birthdate: this.editUserForm.value.fecha,
      name: this.editUserForm.value.nombre,
      gender: this.editUserForm.value.genero,
    };
    console.log(userInfo);
    var response = await this.userServices.EditUserProfile(userInfo);
    if(response){
      console.log("Perfil actualizado");
      this.successMessage = 'Perfil actualizado exitosamente.';
      this.clearMessages();
    }
    else{
      console.log("Error al actualizar el perfil");
      this.errorMessage = 'Error al actualizar el perfil. Verifica los campos.';
      this.clearMessages();
    }
  }
  async onPasswordChange() {
    if (this.passwordForm.valid) {
      console.log("actualizar contraseña");

    } else {
      console.log('Formulario no válido');
    }
    const userInfo: updatePassword = {
      actualPassword: this.passwordForm.value.actual,
      newPassword: this.passwordForm.value.nueva,
      confirmPassword: this.passwordForm.value.confirmar
    };
    console.log(userInfo);
    var response = await this.userServices.EditUserPassword(userInfo);
    if(response){
      console.log("Perfil actualizado");
      this.successMessage = 'Perfil actualizado exitosamente.';
      this.clearMessages();
    }
    else{
      console.log("Error al actualizar el perfil");
      this.errorMessage = 'Error al actualizar el perfil. Verifica los campos.';
      this.clearMessages();
    }
  }
  logout() {
    localStorage.removeItem('auth'); // Elimina el token
    this.isAuthenticated = false;
    this.clearCookies();
    this.navigateTo('iniciarSesion'); // Redirige al inicio de sesión
  }
  async actualizarPlaceholders() {
    const token = localStorage.getItem('auth'); // Cambia a sessionStorage si es necesario
    if (token != null) {
        console.log();
      try {
  
        const auth = JSON.parse(token);
        console.log("auth:",auth);
  
        console.log("nombre:" ,auth.name);
        const response = await this.userServices.InfoUser(auth.id);
        this.nombrePlaceholder = auth.name || 'Nombre actual'; // Cambia 'name' según el payload de tu token
        this.fechaPlaceholder = response.birthdate.toString() || 'Fecha actual'; // Cambia 'name' según el payload de tu token
        this.generoPlaceholder = response.gender || 'Género actual'; // Cambia 'name' según el payload de tu token
        
  
      } catch (error) {
        console.error('Error al decodificar el token', error);
        this.isAuthenticated = false;
      }
  
    }
  }
  clearCookies(): void {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  }
      navigateTo(route: string): void {
      this.router.navigate([route]);
    }
    // Oculta los mensajes después de 3 segundos
clearMessages() {
  setTimeout(() => {
    this.successMessage = null;
    this.errorMessage = null;
  }, 3000);}

}
