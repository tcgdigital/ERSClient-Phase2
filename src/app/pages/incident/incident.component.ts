import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IncidentModel } from '../incident';
import { DataExchangeService } from '../../shared';

@Component({

    selector: 'incident-main',

    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/incident.html'
})
export class IncidentComponent implements OnInit {
    
    
    incident: IncidentModel;
    constructor() {
        
        
    }
    ngOnInit(): any {
        
    }
    ngOnDestroy(): void {
        
    }
    
}