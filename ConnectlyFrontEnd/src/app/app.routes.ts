import { Routes } from '@angular/router';
import { RegisterComponent } from './features/account/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { MemberListComponent } from './features/members/member-list/member-list.component';
import { MemberDetailedComponent } from './features/members/member-detailed/member-detailed.component';
import { ListsComponent } from './features/lists/lists.component';
import { MessagesComponent } from './features/messages/messages.component';
import { authGuard } from './core/guards/auth.guard';
import { registerationGuard } from './core/guards/registeration.guard';
import { NotFoundComponent } from './shared/errors/not-found/not-found.component';
import { ServerErrorComponent } from './shared/errors/server-error/server-error.component';
import { MemberProfileComponent } from './features/members/member-profile/member-profile.component';
import { MemberPhotosComponent } from './features/members/member-photos/member-photos.component';
import { MemberMessagesComponent } from './features/members/member-messages/member-messages.component';
import { memberResolver } from './features/members/member-resolver.resolver';
import { preventUnsavedChangesGuard } from './core/guards/prevent-unsaved-changes.guard';
import { AdminComponent } from './features/admin/admin.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'members', component: MemberListComponent, canActivate: [authGuard] },
    { path: 'members/:id',resolve:{member:memberResolver} ,runGuardsAndResolvers:'always' ,component: MemberDetailedComponent, canActivate: [authGuard],
        children: [
            {path: '', redirectTo: 'profile', pathMatch: 'full'},
            {path: 'profile', component: MemberProfileComponent , title: 'Profile',canDeactivate:[preventUnsavedChangesGuard]},
            {path: 'photos', component: MemberPhotosComponent , title: 'Photos'},
            {path: 'messages', component: MemberMessagesComponent , title: 'Messages'},
        ]
     },
    { path: 'lists', component: ListsComponent, canActivate: [authGuard] },
    { path: 'messages', component: MessagesComponent, canActivate: [authGuard] },
    { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
    { path: 'register', component: RegisterComponent,canActivate: [registerationGuard] },
    {path:'server-error' , component:ServerErrorComponent},
    { path: '**', component:NotFoundComponent }
];
