import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { MessageService } from '../../core/services/message.service';
import { Pagination } from '../../shared/models/pagination';
import { Message } from '../../shared/models/message';
import { PaginatorComponent } from "../../shared/paginator/paginator.component";
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoaderComponent } from "../../shared/loader/loader.component";
import { ConfirmDialogService } from '../../core/services/confirm-dialog-service.service';

@Component({
  selector: 'app-messages',
  imports: [PaginatorComponent, DatePipe, RouterModule, LoaderComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {
  private messageService = inject(MessageService);
  private ConfirmDialog = inject(ConfirmDialogService)

  protected container = 'Inbox';
  protected fetchedContainer = 'Inbox';
  protected pageIndex = 1;
  protected pageSize = 10;
  protected paginatedMessages = signal<Pagination<Message> | null>(null);
  protected isLoading = signal<boolean>(false);

  tabs = [
    { label: 'Inbox', value: 'Inbox' },
    { label: 'Outbox', value: 'Outbox' },
  ];

  totalPages = computed(() => {
    const pagination = this.paginatedMessages();
    if (!pagination) return 0;
    return Math.ceil(pagination.count / pagination.pageSize);
  });

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.isLoading.set(true);
    this.messageService.getMessages(this.container, this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        this.paginatedMessages.set(response);
        this.fetchedContainer = this.container;
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  async ConfirmDelete(event: Event, id: number) {
    event.stopPropagation();
    const ok = await this.ConfirmDialog.confirm('Are you sure you want to delete this message?');
    if (ok) {
      this.deleteMessage(event, +id);
    }
  }

  deleteMessage(event: Event, id: number) {
    event.stopPropagation();
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        this.loadMessages();
        const current = this.paginatedMessages();
        if (current) {
          const newData = current.data.filter(m => m.id !== id);
          const newCount = current.count > 0 ? current.count - 1 : 0;

          this.paginatedMessages.set({
            ...current,
            data: newData,
            count: newCount
          });
        }
      }
    });
  }

  get isInbox() {
    return this.fetchedContainer === 'Inbox';
  }

  setContainer(container: string) {
    this.container = container;
    this.pageIndex = 1;
    this.loadMessages();
  }

  onPageChange(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMessages();
  }
}