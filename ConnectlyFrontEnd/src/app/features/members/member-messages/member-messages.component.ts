import { Component, inject, OnInit, signal, ViewChild, ElementRef, AfterViewChecked, OnDestroy, effect } from '@angular/core';
import { MessageService } from '../../../core/services/message.service';
import { MemberService } from '../../../core/services/member.service';
import { Message } from '../../../shared/models/message';
import { DatePipe } from '@angular/common';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { FormsModule } from '@angular/forms';
import { PresenceService } from '../../../core/services/presence.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-messages',
  imports: [DatePipe, TimeAgoPipe, FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef<HTMLDivElement>;
  
  protected messagesService = inject(MessageService);
  private route = inject(ActivatedRoute);
  protected memberService = inject(MemberService);
  protected presenceService = inject(PresenceService);
  protected messageContent = '';
  private otherUserId = '';
  private shouldScrollToBottom = false;

  constructor() {
    effect(() => {
      const messages = this.messagesService.messageThread();
      if (messages.length > 0) {
        this.shouldScrollToBottom = true;
      }
    });
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe({
      next: params => {
        const userId = params.get('id');
        
        if (!userId) throw new Error('Cannot connect to hub');
        this.otherUserId = userId;
        this.messagesService.createHubConnection(userId);
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Scroll to bottom failed:', err);
    }
  }

  SendMessage(event?: KeyboardEvent) {
    if (event) {
      event.preventDefault();
    }
    
    if (!this.otherUserId || !this.messageContent.trim()) return;
    
    const messageToSend = this.messageContent;
    this.messageContent = ''; 
    this.messagesService.sendMessage(this.otherUserId, messageToSend)
      ?.then(() => {
        this.shouldScrollToBottom = true;
      })
      .catch(error => {
        console.log(error);
      });
  }

  ngOnDestroy(): void {
    this.messagesService.stopHubConnection();
  }
}