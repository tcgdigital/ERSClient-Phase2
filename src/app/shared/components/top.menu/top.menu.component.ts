import { Component } from '@angular/core';
import { TopMenuService } from './top.menu.service';

// import 'style-loader!./top.menu.style.scss';

@Component({
    selector: 'top-menu',
    providers: [TopMenuService],
    styleUrls: ['./top.menu.style.scss'],
    templateUrl: './top.menu.view.html'
})
export class TopMenuComponent {

    public notifications: Object[];
    public messages: Object[];

    constructor(private topMenuService: TopMenuService) {
        this.notifications = this.topMenuService.getNotifications();
        this.messages = this.topMenuService.getMessages();
    }

}