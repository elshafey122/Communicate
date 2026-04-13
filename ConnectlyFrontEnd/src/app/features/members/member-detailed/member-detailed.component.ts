import { Component, computed, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { AccounService } from '../../../core/services/accoun.service';
import { MemberService } from '../../../core/services/member.service';
import { LikesService } from '../../../core/services/likes.service';
import { AgeCalculatorPipe } from '../../../shared/pipes/age-calculator.pipe';
import { ToastService } from '../../../core/services/toast.service';
import { PresenceService } from '../../../core/services/presence.service';

@Component({
  selector: 'app-member-detailed',
  imports: [RouterOutlet, AgeCalculatorPipe, RouterModule],
  templateUrl: './member-detailed.component.html',
  styleUrl: './member-detailed.component.css'
})
export class MemberDetailedComponent implements OnDestroy {
  protected memberService = inject(MemberService);
  private accountService = inject(AccounService);
  private toastService = inject(ToastService);
  private likesService = inject(LikesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  protected presenceService = inject(PresenceService);

  protected isCurrentUser = computed(() => {
    return this.accountService.currentUser()?.id === this.memberService.member()?.id.toLocaleLowerCase();
  });

  protected isLiked = computed(() => {
    const member = this.memberService.member();
    return member ? this.likesService.likeIds().includes(member.id) : false;
  });

  constructor() {
    const memberId = this.route.snapshot.paramMap.get('id')!;
    this.memberService.getMember(memberId);

    this.likesService.getLikeIds();
  }

  ngOnDestroy(): void {
    this.memberService.editMode.set(false);
  }

  likeUser() {
    const member = this.memberService.member();
    if (!member) return;

    this.likesService.toggleLike(member.id).subscribe({
      next: () => {
        const currentLikeIds = this.likesService.likeIds();
        const memberId = member.id;

        if (currentLikeIds.includes(memberId)) {
          this.likesService.likeIds.set(currentLikeIds.filter(id => id !== memberId));
        } else {
          this.likesService.likeIds.set([...currentLikeIds, memberId]);
        }
      },
      error: (error) => {
        this.toastService.Error(error.message);
      }
    });
  }

  goBack() {
    this.router.navigateByUrl('/members');
  }

  toggleEditMode() {
    this.memberService.editMode.set(!this.memberService.editMode());
  }
}