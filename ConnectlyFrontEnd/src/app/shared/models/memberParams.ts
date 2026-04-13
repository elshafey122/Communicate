export class MemberParams {
    pageSize:number=5;
    pageNumber:number=1;
    gender?:string;
    minAge:number=18;
    maxAge:number=100;
    sort = 'lastActive';
}