import { Component, ViewEncapsulation } from '@angular/core';
import { BroadCastModel } from './components';
import { UtilityService } from '../../../shared/services';



@Component({
    selector: 'broadcast-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/broadcast.view.html',
    styleUrls: ['./styles/broadcast.style.scss']
})
export class BroadcastComponent {
    evtBroadcast: BroadCastModel;
    initiatedDepartment: number;
    incidentId: number;

    getNotification(evt: BroadCastModel) {
        this.evtBroadcast = evt;
    }
    ngOnInit(): any {
        this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.initiatedDepartment = +UtilityService.GetFromSession("CurrentDepartmentId");
    }
}