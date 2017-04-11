import { Component, ViewEncapsulation } from '@angular/core';
import { PresidentMessageModel } from './components';
import { UtilityService } from '../../../shared/services';


@Component({
    selector: 'presidentMessage-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/presidentMessage.view.html',
    styleUrls: ['./styles/presidents.message.style.scss']

})
export class PresidentMessageComponent {
    evtPresidentMessage: PresidentMessageModel;
    initiatedDepartment: number;
    incidentId: number;

    getNotification(evt: PresidentMessageModel) {
        this.evtPresidentMessage = evt;
    }
    ngOnInit(): any {
        this.incidentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.initiatedDepartment = +UtilityService.GetFromSession("CurrentDepartmentId");
    }
}