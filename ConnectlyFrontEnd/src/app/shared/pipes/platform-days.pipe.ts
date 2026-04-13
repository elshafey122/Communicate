import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'platformDays'
})
export class PlatformDaysPipe implements PipeTransform {

  transform(created: string): number {
    const now = new Date().getTime();
    const createdTime = new Date(created).getTime();
    const diffInDays = Math.floor((now - createdTime) / (1000 * 60 * 60 * 24));
    return diffInDays;
  }

}
