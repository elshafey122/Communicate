import { CanActivateFn, Router } from '@angular/router';
import { AccounService } from '../services/accoun.service';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccounService);
  const toastService = inject(ToastService);
  const router = inject(Router);


  if (accountService.currentUser()?.roles.includes('Admin') || accountService.currentUser()?.roles.includes('Moderator')) {
    return true;
  }
  else {
    toastService.Warning('You are already logged in.');
    router.navigate(['/home']);
    return false;
  }
};
