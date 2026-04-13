import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { EditableMember, Member } from '../../../shared/models/member';
import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import { AgeCalculatorPipe } from '../../../shared/pipes/age-calculator.pipe';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { PlatformDaysPipe } from '../../../shared/pipes/platform-days.pipe';
import { ActivityStatusPipe } from '../../../shared/pipes/activity-status.pipe';
import { AccounService } from '../../../core/services/accoun.service';
import { MemberService } from '../../../core/services/member.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-member-profile',
  imports: [
    CommonModule,
    DatePipe,
    SlicePipe,
    AgeCalculatorPipe,
    TimeAgoPipe,
    PlatformDaysPipe,
    ActivityStatusPipe,
    FormsModule
  ],
  templateUrl: './member-profile.component.html',
  styleUrl: './member-profile.component.css'
})
export class MemberProfileComponent implements OnInit {
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: BeforeUnloadEvent) {
    if (this.editForm?.dirty)
      $event.preventDefault();
  }
  private accountService = inject(AccounService);
  private toast = inject(ToastService)
  protected memberService = inject(MemberService);
  protected editableMember: EditableMember = {
    userName: '',
    description: '',
    city: '',
    country: ''
  };

  ngOnInit(): void {
    this.editableMember = {
      userName: this.memberService.member()?.userName || '',
      description: this.memberService.member()?.description || '',
      city: this.memberService.member()?.city || '',
      country: this.memberService.member()?.country || ''
    };
  }

  updateProfile() {
    if (!this.memberService.member()) return;
    const updatedMember = {
      ...this.memberService.member(), ...this.editableMember
    };
    this.memberService.updateMember(this.editableMember).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser();
        if(currentUser && updatedMember.userName !== currentUser?.userName){
          currentUser.userName = updatedMember.userName;
          this.accountService.setUser(currentUser);
        }
        this.toast.Success('Profile updated successfully');
        this.memberService.editMode.set(false);
        this.memberService.member.set(updatedMember as Member);
        this.editForm?.reset(updatedMember);
      }
    })
  }
}