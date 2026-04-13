import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';
import { catchError, interval, of, Subscription, tap } from 'rxjs';
import { User, RegisterDto, LoginDto } from '../../shared/models/user';
import { LikesService } from './likes.service';
import { PresenceService } from './presence.service';
import { HubConnectionState } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class AccounService {
  private baseUrl = environment.apiUrl + 'account/';
  private http = inject(HttpClient);
  private router = inject(Router);
  private likesService = inject(LikesService);
  private presenceService = inject(PresenceService);

  private userSignal = signal<User | null>(this.getUserFromLocalStorage());
  readonly currentUser = computed(() => this.userSignal());

  private refreshIntervalSubscription: Subscription | null = null;

  constructor() {
    this.tryRefreshTokenOnStartup();
  }

  register(registerDto: RegisterDto) {
    return this.http.post<User>(this.baseUrl + 'register', registerDto, { withCredentials: true }).pipe(
      tap(user => this.setUser(user))
    );
  }

  login(loginDto: LoginDto) {
    return this.http.post<User>(this.baseUrl + 'login', loginDto, { withCredentials: true }).pipe(
      tap(user => this.setUser(user))
    );
  }

  logout() {
    return this.http.post(this.baseUrl + 'logout', {}, { withCredentials: true }).pipe(
      tap(() => {
        this.stopAutoRefresh();
        this.likesService.clearLikeIds();
        this.setUser(null);
        this.router.navigate(['/home']);
      })
    );
  }

  getCurrentUser() {
    return this.http.get<User>(this.baseUrl + 'get-current-user', { withCredentials: true }).pipe(
      tap(user => this.setUser(user))
    );
  }

  refreshToken() {
    return this.http.post<User>(this.baseUrl + 'refresh-token', {}, { withCredentials: true }).pipe(
      tap(user => this.setUser(user)),
      catchError(() => {
        this.stopAutoRefresh();
        this.setUser(null);
        return of(null);
      })
    );
  }

  private tryRefreshTokenOnStartup() {
    const user = this.getUserFromLocalStorage();
    if (user) {
      this.startAutoRefresh();
    } else {
      this.refreshToken().subscribe(res => {
        if (res) this.startAutoRefresh();
      });
    }
  }


  private startAutoRefresh() {
    this.stopAutoRefresh(); 
    const SIX_MINUTES =  14 * 60 * 1000;

    this.refreshIntervalSubscription = interval(SIX_MINUTES).subscribe(() => {
      this.refreshToken().subscribe();
    });
  }

  private stopAutoRefresh() {
    if (this.refreshIntervalSubscription) {
      this.refreshIntervalSubscription.unsubscribe();
      this.refreshIntervalSubscription = null;
    }
  }

  private getUserFromLocalStorage(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  setUser(user: User | null) {
    if (user) {
      user.roles = this.getRolesFromToken(user);
      localStorage.setItem('user', JSON.stringify(user));
      this.userSignal.set(user);
      this.likesService.getLikeIds();
      this.startAutoRefresh();
      if(this.presenceService.hubConnection?.state!==  HubConnectionState.Connected )
        this.presenceService.CreateHubConnection(user);
    } else {
      localStorage.removeItem('user');
      this.userSignal.set(null);
      this.stopAutoRefresh();
    }
  }

  private getRolesFromToken(user: User): string[] {
    if (!user?.token) return [];
    const payload = user.token.split('.')[1];
    const decodedPayload = atob(payload);
    const tokenData = JSON.parse(decodedPayload);
    return Array.isArray(tokenData.role) ? tokenData.role : [tokenData.role];
  }
}
