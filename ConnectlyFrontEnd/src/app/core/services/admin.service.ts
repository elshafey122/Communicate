import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { User } from '../../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = environment.apiUrl + 'admin';
  private http = inject(HttpClient);

  getUsersWithRoles() {
    return this.http.get<User[]>(this.baseUrl + '/users-with-roles');
  }

  updateUserRoles(userId: string, roles: string[]) {
    return this.http.put<string[]>(this.baseUrl + '/edit-roles/' + userId + '?roles=' + roles, {});
  }
}
