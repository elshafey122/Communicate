import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member.service';
import { ActivatedRoute } from '@angular/router';
import { Member, Photo } from '../../../shared/models/member';
import { ImageUploadComponent } from "../../../shared/image-upload/image-upload.component";
import { AccounService } from '../../../core/services/accoun.service';
import { User } from '../../../shared/models/user';
import { DeleteButtonComponent } from "../../../shared/delete-button/delete-button.component";

@Component({
  selector: 'app-member-photos',
  imports: [ImageUploadComponent, DeleteButtonComponent],
  templateUrl: './member-photos.component.html',
  styleUrl: './member-photos.component.css'
})
export class MemberPhotosComponent implements OnInit {
  protected memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  protected accountService = inject(AccounService);
  protected photos = signal<Photo[]>([]);
  protected loading = signal(false);


  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id')!;

    if (memberId)
      this.memberService.getMemberPhotos(memberId).subscribe({
        next: photos => this.photos.set(photos)
      });
  }

  onUploadImage(file: File) {
    this.loading.set(true);
    this.memberService.uploadPhoto(file).subscribe({
      next: photo => {
        this.memberService.editMode.set(false);
        this.loading.set(false);
        this.photos.update(photos => [...photos, photo]);
        if(!this.memberService.member()?.imageUrl) 
          this.setMainLocalPhoto(photo);
      },
      error: err => {
        console.log(err);
        this.loading.set(false);
      }
    });
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo).subscribe({
      next: () => {
        this.setMainLocalPhoto(photo);
      }
    });
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        this.photos.update(photos => photos.filter(p => p.id !== photoId));
      }
    });
  }


  private setMainLocalPhoto(photo: Photo) {
    const currentUser = this.accountService.currentUser();
    if (currentUser && photo.url)
      currentUser.imageUrl = photo.url;
    this.accountService.setUser(currentUser as User);
    this.memberService.member.update(member => ({ ...member, imageUrl: photo.url }) as Member);
  }
}