import { Component, ViewEncapsulation } from '@angular/core';
import { BroadCastDepartmentModel } from './components';

@Component({
    selector: 'broadcastDepartment-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/broadcast.department.view.html'
})
export class BroadcastDepartmentComponent {
    evtBroadcastDepartmentMapping: BroadCastDepartmentModel;

    getNotification(evt: BroadCastDepartmentModel) {
        this.evtBroadcastDepartmentMapping = evt;
    }
}