import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../../core/services/likes.service';
import { Member } from '../../shared/models/member';
import { MemberCardComponent } from "../members/member-card/member-card.component";
import { LoaderComponent } from "../../shared/loader/loader.component";

@Component({
  selector: 'app-lists',
  imports: [MemberCardComponent, LoaderComponent],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent implements OnInit {
  private likesService = inject(LikesService);
  protected members = signal<Member[]>([]);
  protected isLoading = signal<boolean>(false);
  protected predicate = 'liked';

  tabs = [
    { label: 'Liked', value: 'liked' },
    { label: 'Liked By', value: 'likedby' },
    { label: 'Mutual Likes', value: 'mutual' }
  ];

  ngOnInit(): void {
    this.loadLikes();
  }

  setPredicate(predicate: string) {
    this.predicate = predicate;
    this.loadLikes();
  }

  loadLikes() {
    this.isLoading.set(true);

    this.likesService.getLikes(this.predicate).subscribe({
      next: members => {
        this.members.set(members);
        this.isLoading.set(false);

      }
    });
  }
}
