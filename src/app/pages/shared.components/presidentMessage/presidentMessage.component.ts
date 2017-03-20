import { Component, ViewEncapsulation } from '@angular/core';
import { PresidentMessageModel } from './components';

@Component({
    selector: 'presidentMessage-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/presidentMessage.view.html'
})
export class PresidentMessageComponent {
    evtPresidentMessage: PresidentMessageModel;

    getNotification(evt: PresidentMessageModel) {
        this.evtPresidentMessage = evt;
    }
}