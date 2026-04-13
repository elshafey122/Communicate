import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AccounService } from '../services/accoun.service';
import { Router } from '@angular/router';

let isLoggingOut = false;

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccounService);
  const router = inject(Router);

  const user = accountService.currentUser();  

  let authReq = req;
  if (user && user.token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user.token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isLoggingOut && !req.url.includes('/login')) {
        isLoggingOut = true;

        accountService.logout().subscribe(() => {
          router.navigate(['/home']).then(() => {
            isLoggingOut = false;
          });
        });
      }
      
      return throwError(() => error);
    })
  );
};
