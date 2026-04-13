import { Component, inject } from '@angular/core';
import { AccounService } from '../../core/services/accoun.service';
import { UserManagementComponent } from "./user-management/user-management.component";
import { PhotoManagementComponent } from "./photo-management/photo-management.component";

@Component({
  selector: 'app-admin',
  imports: [UserManagementComponent, PhotoManagementComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  protected accountService = inject(AccounService);
  activeTab = 'photos'
  tabs = [
    { value: 'photos', label: 'Photo Management' },
    { value: 'roles', label: 'User Management' }
  ]

  setTab(tab: string) {
    this.activeTab = tab;
  }
}
