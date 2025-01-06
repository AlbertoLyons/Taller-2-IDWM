import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Expresión regular para verificar el formato 'aaaa-mm-dd'
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (control.value && !regex.test(control.value)) {
      return { invalidDateFormat: 'La fecha debe tener el formato "aaaa-mm-dd"' };
    }

    return null;  // Válido
  };
}
