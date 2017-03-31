import { Component, OnInit, Input } from '@angular/core';
import { CheckListSummeryModel } from './checklist.summary.widget.model';
import { ChecklistSummaryWidgetService } from './checklist.summary.widget.service';

@Component({
    selector: 'checklistSummary-widget',
    templateUrl: './checklist.summary.widget.view.html',
    styleUrls: ['./checklist.summary.widget.style.scss']
})
export class ChecklistSummaryWidgetComponent implements OnInit {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;

    checkListSummery: CheckListSummeryModel = null;
    constructor(private checklistSummaryWidgetService:ChecklistSummaryWidgetService) { }

    ngOnInit() { 
        this.checkListSummery = new CheckListSummeryModel();
        this.checklistSummaryWidgetService.GetActionableCount(this.incidentId,this.departmentId)
        .subscribe(checkListSummeryObservable => {
                this.checkListSummery = checkListSummeryObservable;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }
}