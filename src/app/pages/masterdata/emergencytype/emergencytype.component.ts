import { Component, ViewEncapsulation } from '@angular/core';
import { EmergencyTypeModel } from './components';

@Component({
    selector: 'emergencytype-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/emergencytype.view.html',
    styleUrls:['./styles/emergencytype.style.scss']
})
export class EmergencyTypeComponent {

    evtEmergencyType: EmergencyTypeModel;

    getNotification(evt: EmergencyTypeModel) {
        this.evtEmergencyType = evt;
    }
}