import { Component, ViewEncapsulation } from '@angular/core';
import { BroadCastModel } from './components';

@Component({
    selector: 'broadcast-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/broadcast.view.html'
})
export class BroadcastComponent {
    evtBroadcast: BroadCastModel;

    getNotification(evt: BroadCastModel) {
        this.evtBroadcast = evt;
    }
}