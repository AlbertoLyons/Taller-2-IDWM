import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function genderValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const validValues = ['Femenino', 'Masculino', 'Otro', 'Prefiero no decirlo'];

    if (control.value && !validValues.includes(control.value)) {
      return { invalidGender: 'El género debe ser uno de los siguientes: Femenino, Masculino, Otro, Prefiero no decirlo.' };
    }

    return null;  // Válido
  };
}
