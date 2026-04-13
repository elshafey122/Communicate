import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ToastService } from './toast.service';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { User } from '../../shared/models/user';
import { Message } from '../../shared/models/message';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  private hubUrl = environment.hubUrl;
  private toastService = inject(ToastService);
  hubConnection?: HubConnection;
  onlineUsers = signal<string[]>([]);

  CreateHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('UserIsOnline', userId => {
      this.onlineUsers.update(users => [...users, userId]);
    });

    this.hubConnection.on('UserIsOffline', userId => {
      this.onlineUsers.update(users => users.filter(u => u !== userId));
    });

    this.hubConnection.on('GetOnlineUsers', (userIds: string[]) => {
      this.onlineUsers.set(userIds);
    });

    this.hubConnection.on('NewMessageReceived', (message: Message) => {
      console.log(message.senderImageUrl);
      
      this.toastService.Info(`New message from ${message.senderUserName}`, 10000 ,
         message.senderImageUrl , `/members/${message.senderId}/messages`);
    });

  }

  StopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected)
      this.hubConnection.stop().catch(error => console.log(error));
  }
}
