import { Component, ElementRef, inject, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { User } from '../../../shared/models/user';

@Component({
  selector: 'app-user-management',
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  @ViewChild('rolesModal') rolesModal!: ElementRef<HTMLDialogElement>;
  private adminService = inject(AdminService);
  protected users = signal<User[]>([]);
  protected availableRoles = ['Admin', 'Moderator', 'Member'];
  protected selectedUser: User | null = null;

   ngOnInit(): void {
    this.getUsersWithRoles();
    
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe({
      next: users => this.users.set(users)
    })
  }

  openRolesModal(user: User) {
    this.selectedUser = user;
    this.rolesModal.nativeElement.showModal();
  }

  toggleRole(evemt: Event, role: string) {
    if (!this.selectedUser) return;
    const checkbox = evemt.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedUser.roles.push(role);
    } else {
      this.selectedUser.roles = this.selectedUser.roles.filter(r => r !== role);
    }
  }

  updateUserRoles() {
    if (!this.selectedUser) return;
    this.adminService.updateUserRoles(this.selectedUser.id, this.selectedUser.roles).subscribe({
      next: (updatedRoles) => {
        this.users.update(users =>users.map(user => {
          if (user.id === this.selectedUser?.id) user.roles = updatedRoles;
          return user;
        }));
        this.rolesModal.nativeElement.close()
      },
      error: error => console.log(error)
    })
  }
}
