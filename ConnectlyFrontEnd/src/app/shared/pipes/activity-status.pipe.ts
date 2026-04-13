import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activityStatus'
})
export class ActivityStatusPipe implements PipeTransform {

  transform(lastActive: string): string {
    const now = new Date().getTime();
    const activeTime = new Date(lastActive).getTime();
    const diffInHours = Math.floor((now - activeTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Very Active';
    if (diffInHours < 24) return 'Active';
    if (diffInHours < 168) return 'Moderate'; // 1 week
    if (diffInHours < 720) return 'Inactive'; // 1 month
    return 'Dormant';
  }

}
