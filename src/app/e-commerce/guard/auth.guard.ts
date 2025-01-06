import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage-service.service';

export const authGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);

  if (localStorageService.getVariable('token')) {
    if (localStorageService.getVariable('role') === 'admin') {
      router.navigate(['/view-products-admin']);
    }
    return true;
  }
  router.navigate(['/login']);
  return false;
};
