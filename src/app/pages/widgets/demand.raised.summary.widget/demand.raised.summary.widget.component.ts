import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { DemandRaisedSummeryModel } from './demand.raised.summary.widget.model';
import { DemandRaisedSummaryWidgetService } from './demand.raised.summary.widget.service';

@Component({
    selector: 'demand-raised-summary-widget',
    templateUrl: './demand.raised.summary.widget.view.html',
    encapsulation: ViewEncapsulation.None
})
export class DemandRaisedSummaryWidgetComponent implements OnInit {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;
public demandRaisedSummery: DemandRaisedSummeryModel;
    constructor(private demandRaisedSummaryWidgetService: DemandRaisedSummaryWidgetService) { }

    public ngOnInit(): void { 
        this.demandRaisedSummery = new DemandRaisedSummeryModel();
        this.demandRaisedSummery=this.demandRaisedSummaryWidgetService.GetDemandRaisedCount(this.incidentId,this.departmentId);
    
    }
}