import { Component, computed, input, model, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent {
  // Signals
  pageNumber = model(1);
  pageSize = model(10);

  // Inputs from parent
  totalCount = input(0);
  totalPages = input(0);

  // Options for dropdown
  pageSizeOptions = [5, 10, 20, 50];

  // Output event
  pageChange = output<{ pageIndex: number; pageSize: number }>();

  // Computed: last item index in current page
  lastItemIndex = computed(() => {
    return Math.min(this.pageNumber() * this.pageSize(), this.totalCount());
  });

  // Computed: visible page numbers with ellipsis logic
  visiblePages = computed(() => {
    const current = this.pageNumber();
    const total = this.totalPages();
    const pages: (number | string)[] = [];

    if (total <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current <= 4) {
        // Show pages 2, 3, 4, 5 and ellipsis
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 3) {
        // Show ellipsis and last 4 pages
        pages.push('...');
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        // Show ellipsis, current page with neighbors, ellipsis
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      }
    }

    return pages;
  });

  // Helper method to handle page number clicks
  onPageNumberClick(page: number | string) {
    if (typeof page === 'number') {
      this.onPageChange(page);
    }
  }

  // Handle page/size changes
  onPageChange(newPage?: number, pageSizeTarget?: EventTarget | null) {
    if (pageSizeTarget) {
      const size = Number((pageSizeTarget as HTMLSelectElement).value);
      this.pageSize.set(size);
      this.pageNumber.set(1); // reset to first page on size change
    }

    if (newPage !== undefined && newPage > 0 && newPage <= this.totalPages()) {
      this.pageNumber.set(newPage);
    }

    this.pageChange.emit({
      pageIndex: this.pageNumber(),
      pageSize: this.pageSize()
    });
  }
}