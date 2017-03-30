import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
    selector: 'demand-raised-summary-widget',
    templateUrl: './demand.raised.summary.widget.view.html',
    encapsulation: ViewEncapsulation.None
})
export class DemandRaisedSummaryWidgetComponent implements OnInit {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;

    constructor() { }

    public ngOnInit(): void { }
}