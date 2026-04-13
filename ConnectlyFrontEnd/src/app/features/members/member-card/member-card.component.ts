import { Component, input, computed, inject } from '@angular/core';
import { Member } from '../../../shared/models/member';
import { RouterModule } from '@angular/router';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { PlatformDaysPipe } from '../../../shared/pipes/platform-days.pipe';
import { AgeCalculatorPipe } from '../../../shared/pipes/age-calculator.pipe';
import { LikesService } from '../../../core/services/likes.service';
import { ToastService } from '../../../core/services/toast.service';
import { PresenceService } from '../../../core/services/presence.service';

@Component({
  selector: 'app-member-card',
  imports: [RouterModule, TimeAgoPipe, PlatformDaysPipe, AgeCalculatorPipe],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {
  private likesService = inject(LikesService);
  private toastService = inject(ToastService);
  private presenceService = inject(PresenceService);
  member = input.required<Member>();
  protected isOnline = computed(() => {
    return this.presenceService.onlineUsers().includes(this.member().id);
  });

  protected isLiked = computed(() => this.likesService.likeIds().includes(this.member().id));

  toggleLike(event: Event) {    
    event.preventDefault(); 
    event.stopPropagation(); 
    
    this.likesService.toggleLike(this.member().id).subscribe({
      next: () => {
        const currentLikeIds = this.likesService.likeIds();
        const memberId = this.member().id;
        
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
}