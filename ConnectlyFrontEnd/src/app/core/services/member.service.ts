import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { EditableMember, Member, Photo } from '../../shared/models/member';
import { tap } from 'rxjs';
import { Pagination } from '../../shared/models/pagination';
import { MemberParams } from '../../shared/models/memberParams';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private baseUrl = environment.apiUrl; 
  private http = inject(HttpClient);
  editMode = signal(false);
  member = signal<Member | null>(null);

  getMembers(MemberParams: MemberParams) {
    let params = new HttpParams();


  params = params.append('pageSize', MemberParams.pageSize);
  params = params.append('pageIndex', MemberParams.pageNumber);
  params = params.append('minAge', MemberParams.minAge);
  params = params.append('maxAge', MemberParams.maxAge);
  params = params.append('sort', MemberParams.sort);
  if(MemberParams.gender) params = params.append('gender',MemberParams.gender)
    return this.http.get<Pagination<Member>>(`${this.baseUrl}members`, { params });
  }

  getMember(id: string) {
    return this.http.get<Member>(`${this.baseUrl}members/${id}`).pipe(
       tap(member => this.member.set(member))
    );
  }

  getMemberPhotos(id: string) {
    return this.http.get<Photo[]>(`${this.baseUrl}members/${id}/photos`);
  }

  updateMember(member: EditableMember) {
    return this.http.put(`${this.baseUrl}account`, member);
  }

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Photo>(`${this.baseUrl}account/add-photo`, formData);
  }

  setMainPhoto(photo: Photo) {
    return this.http.put(`${this.baseUrl}account/set-main-photo/${photo.id}`, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(`${this.baseUrl}account/delete-photo/${photoId}`);
  }

}
