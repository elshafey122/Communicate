import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private router = inject(Router)

  private CreateToastContainer() {
    if(!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast toast-bottom toast-end';
      document.body.appendChild(container);
    }
  }

  private CreateToastElement(message: string, alertClass:string, duration:number=5000,
    avatar?:string , route?:string) {
    this.CreateToastContainer();
    const toastContainer = document.getElementById('toast-container');
    if(!toastContainer) return;

    const toast = document.createElement('div');
    toast.classList.add('alert', alertClass, 'shadow-lg','z-50','flex', 'items-center','gap-3', 'cursor-pointer')

      if(route) {
        toast.addEventListener('click', (e) => {
          if ((e.target as HTMLElement).tagName !== 'BUTTON') {
            this.router.navigateByUrl(route);
            toastContainer.removeChild(toast);
          }
        });
      }

    // Fixed: Use proper image URL or default, removed Angular binding syntax
    const imageUrl = avatar || 'https://www.gravatar.com/avatar/?d=mp&s=200';
    
    toast.innerHTML = `
      ${avatar !== undefined ? `<img src="${imageUrl}" class="w-10 h-10 rounded">` : ''}
      <span>${message}</span>
      <button class="btn btn-sm btn-ghost ml-44">X</button>
    `;

    toast.querySelector('button')?.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering the route navigation
      toastContainer.removeChild(toast);
    });

    toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        toastContainer.removeChild(toast);
      }
    }, duration);
  }


  // Fixed: Pass avatar and route parameters to CreateToastElement
  Success(message: string, duration?: number,
    avatar?:string , route?:string) {
    this.CreateToastElement(message, 'alert-success', duration, avatar, route);
  }
  Error(message: string, duration?: number,
    avatar?:string , route?:string) {
    this.CreateToastElement(message, 'alert-error', duration, avatar, route);
  }
  Warning(message: string, duration?: number,
    avatar?:string , route?:string) {
    this.CreateToastElement(message, 'alert-warning', duration, avatar, route);
  }
  Info(message: string, duration?: number,
    avatar?:string , route?:string) {
    this.CreateToastElement(message, 'alert-info', duration, avatar, route);
  }

}