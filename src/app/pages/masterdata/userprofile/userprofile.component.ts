import { Component, ViewEncapsulation } from '@angular/core';
import { UserProfileModel } from './components';

@Component({
    selector: 'userprofile-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/userprofile.view.html',
    styleUrls: ['./styles/userprofile.style.scss']
})
export class UserProfileComponent {

    evtUserProfile: UserProfileModel;

    getNotification(evt: UserProfileModel) {
        this.evtUserProfile = evt;
    }
}