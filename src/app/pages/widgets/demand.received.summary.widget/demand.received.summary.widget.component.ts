import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
    selector: 'demand-received-summary-widget',
    templateUrl: './demand.received.summary.widget.view.html',
    encapsulation: ViewEncapsulation.None
})
export class DemandReceivedSummaryWidgetComponent implements OnInit {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;

    constructor() { }

    public ngOnInit(): void { }
}