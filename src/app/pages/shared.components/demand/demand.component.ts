import { Component, ViewEncapsulation } from '@angular/core';
import { Route , ActivatedRoute } from '@angular/router';

import { ApprovedDemandComponent, AssignedDemandComponent ,
    CompletedDemandComponent ,MyDemandComponent } from './components';

@Component({
    selector: 'demand-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/demand.view.html'
})
export class DemandComponent {
    
}