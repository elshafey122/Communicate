import { CanActivateFn, Router } from '@angular/router';
import { AccounService } from '../services/accoun.service';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

export const authGuard: CanActivateFn = () => {
  const accountService = inject(AccounService);
  const toast = inject(ToastService);
  const router = inject(Router);
  
  if(!accountService.currentUser()) {
    toast.Error('You must be logged in to access this page.');
    router.navigate(['/home']);
    return false;
  }
  else
    return true;
};
