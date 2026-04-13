import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccounService } from '../services/accoun.service';
import { ToastService } from '../services/toast.service';

export const registerationGuard: CanActivateFn = () => {
  const accountService = inject(AccounService);
  const toast = inject(ToastService);
  const router = inject(Router);
  
  if(accountService.currentUser()) {
    toast.Warning('You are already logged in.');
    router.navigate(['/home']);
    return false;
  }
  else
    return true;
};
