import { Component, ViewEncapsulation } from '@angular/core';
import { PresidentMessageModel } from './components';
import { UtilityService } from '../../../shared/services';
import { Router, NavigationEnd } from '@angular/router';
import {Subscription } from 'rxjs/Rx';


@Component({
    selector: 'presidentMessage-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/presidentMessage.view.html',
    styleUrls: ['./styles/presidents.message.style.scss']

})
export class PresidentMessageComponent {    
    
}
