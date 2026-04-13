import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Pagination } from '../../shared/models/pagination';
import { Message } from '../../shared/models/message';
import { AccounService } from './accoun.service';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = environment.apiUrl + 'messages';
  private hubUrl = environment.hubUrl;
  private http = inject(HttpClient);
  private accountService = inject(AccounService);
  private hubConnection?: HubConnection
  messageThread = signal<Message[]>([]);

  createHubConnection(otherUserId: string) {
  const currentUser = this.accountService.currentUser();
  if (!currentUser) return;
  
  this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl + 'messages?userId=' + otherUserId, {
      accessTokenFactory: () => currentUser.token
    })
    .withAutomaticReconnect()
    .build();

  this.hubConnection.start().catch(error => console.log(error));

  this.hubConnection.on('ReceiveMessageThread', (messages: Message[]) => {
    this.messageThread.set(messages.map(m => ({ 
      ...m, 
      currentUserSender: m.senderId !== otherUserId 
    })));
  });

  this.hubConnection.on('NewMessage', (message: Message) => {
    this.messageThread.update(messages => [...messages, { 
      ...message, 
      currentUserSender: message.senderId === currentUser.id 
    }]);
  });
}

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected)
      this.hubConnection?.stop().catch(error => console.log(error));
  }

  getMessages(container: string, pageIndex: number, pageSize: number,) {
    let params = new HttpParams();

    params = params.append('pageSize', pageSize);
    params = params.append('pageIndex', pageIndex);
    params = params.append('container', container);
    return this.http.get<Pagination<Message>>(`${this.baseUrl}`, { params });
  }

  getMessageThread(memberId: string) {
    return this.http.get<Message[]>(`${this.baseUrl}/thread/${memberId}`);
  }

  sendMessage(recipientId: string, content: string) {
    return this.hubConnection?.invoke('SendMessage', { recipientId, content });
  }

  deleteMessage(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}