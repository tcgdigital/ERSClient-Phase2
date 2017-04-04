import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { DemandReceivedSummeryModel } from './demand.received.summary.widget.model';
import { DemandReceivedSummaryWidgetService } from './demand.received.summary.widget.service';

@Component({
    selector: 'demand-received-summary-widget',
    templateUrl: './demand.received.summary.widget.view.html',
    encapsulation: ViewEncapsulation.None
})
export class DemandReceivedSummaryWidgetComponent implements OnInit {
    @Input('currentIncidentId') incidentId: number;
    @Input('initiatedDepartmentId') departmentId: number;
    public demandReceivedSummery: DemandReceivedSummeryModel;
    constructor(private demandReceivedSummaryWidgetService: DemandReceivedSummaryWidgetService) { }

    public ngOnInit(): void {
        this.demandReceivedSummery = new DemandReceivedSummeryModel();
        this.demandReceivedSummery=this.demandReceivedSummaryWidgetService.GetDemandReceivedCount(this.incidentId,this.departmentId);
    }
}