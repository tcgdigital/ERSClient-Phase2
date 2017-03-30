import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
    selector: 'casualty-summary-widget',
    templateUrl: './casualty.summary.widget.view.html',
    encapsulation: ViewEncapsulation.None
})
export class CasualtySummaryWidgetComponent implements OnInit {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;

    constructor() { }

    public ngOnInit(): void { }
}