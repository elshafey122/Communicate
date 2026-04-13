import { Component, inject, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../core/services/member.service';
import { Member } from '../../../shared/models/member';
import { MemberCardComponent } from '../member-card/member-card.component';
import { Pagination } from '../../../shared/models/pagination';
import { MemberParams } from '../../../shared/models/memberParams';
import { PaginatorComponent } from '../../../shared/paginator/paginator.component';
import { FilterModalComponent } from '../../filter-modal/filter-modal.component';
import { LoaderComponent } from "../../../shared/loader/loader.component";

@Component({
  selector: 'app-member-list',
  imports: [MemberCardComponent, PaginatorComponent, FilterModalComponent, LoaderComponent],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent {
  @ViewChild('filterModal') modal!: FilterModalComponent;
  private memberService = inject(MemberService);
  protected paginatedMembers = signal<Pagination<Member> | null>(null);
  protected params = new MemberParams();
  protected isLoading = signal<boolean>(false);
  
  totalPages = signal(1);

  constructor() {
    this.loadMembers();
  }

  loadMembers() {
    this.isLoading.set(true);
    this.memberService.getMembers(this.params).subscribe({
      next: (response) => {
        const calculatedTotalPages = Math.ceil(response.count / this.params.pageSize) || 1;
        this.totalPages.set(calculatedTotalPages);
        this.paginatedMembers.set(response);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.params.pageNumber = event.pageIndex;
    this.params.pageSize = event.pageSize;
    this.loadMembers();
  }

  openModal(){
    this.modal.open();
  }

  resetFilters(){
    this.params = new MemberParams();
    this.loadMembers();
  }
  
  onClose(){

  }

  onFilterChange(data: MemberParams){
    this.params = data;
    this.loadMembers();
  }
}