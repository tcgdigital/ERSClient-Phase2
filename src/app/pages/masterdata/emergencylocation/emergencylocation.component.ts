import { Component, ViewEncapsulation } from '@angular/core';
import { EmergencyLocationModel } from './components';

@Component({
    selector: 'emergencylocation-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/emeregencylocation.view.html',
    styleUrls: ['./styles/emeregencylocation.style.scss']
})
export class EmergencyLocationComponent {
    EmergencyLocation: EmergencyLocationModel;
}