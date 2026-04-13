import { Component, ElementRef, output, ViewChild, viewChild } from '@angular/core';
import { MemberParams } from '../../shared/models/memberParams';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-modal',
  imports: [FormsModule],
  templateUrl: './filter-modal.component.html',
  styleUrl: './filter-modal.component.css'
})
export class FilterModalComponent {
  @ViewChild('filterModal') modalRef!: ElementRef<HTMLDialogElement>;
  closeModal = output() //notifies parent to refresh data
  submitData = output<MemberParams>() //sends new filter params to parent
  params = new MemberParams();

  open() {
    this.modalRef.nativeElement.showModal();
  }

  close() {
    this.modalRef.nativeElement.close();
    this.closeModal.emit();
  }

  submit() {
    this.submitData.emit(this.params);
    this.close();
  }

  onMinAgeChange() {
    if (this.params.minAge < 18) this.params.minAge = 18;
  }

  onMaxAgeChange() {
    if (this.params.maxAge < this.params.minAge) this.params.minAge = this.params.maxAge;
  }

}
