import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AccounService } from './core/services/accoun.service';
import { NavComponent } from './layout/nav/nav.component';
import { ConfirmDialogComponent } from "./shared/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavComponent, ConfirmDialogComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private accountService = inject(AccounService);

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.accountService.getCurrentUser().subscribe({
        next: (user) => {
        },
        error: (error) => {
          localStorage.removeItem('user');
        }
      });
    }
  }
}