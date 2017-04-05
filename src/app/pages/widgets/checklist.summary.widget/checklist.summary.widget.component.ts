import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { CheckListSummeryModel } from './checklist.summary.widget.model';
import { ChecklistSummaryWidgetService } from './checklist.summary.widget.service';
import { GlobalStateService } from '../../../shared';


@Component({
    selector: 'checklist-summary-widget',
    templateUrl: './checklist.summary.widget.view.html',
    encapsulation: ViewEncapsulation.None
})
export class ChecklistSummaryWidgetComponent implements OnInit {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;


    public checkListSummery: CheckListSummeryModel;
    currentDepartmentId: number;
    currentIncidentId: number;

    /**
     * Creates an instance of ChecklistSummaryWidgetComponent.
     * @param {ChecklistSummaryWidgetService} checklistSummaryWidgetService 
     * 
     * @memberOf ChecklistSummaryWidgetComponent
     */
    constructor(private checklistSummaryWidgetService: ChecklistSummaryWidgetService,
        private globalState: GlobalStateService) { }

    getActionableCount(incidentId, departmentId): void {
        this.checkListSummery = new CheckListSummeryModel();
        this.checklistSummaryWidgetService.GetActionableCount(incidentId, departmentId)
            .subscribe(checkListSummeryObservable => {
                this.checkListSummery = checkListSummeryObservable;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    public ngOnInit(): void {
        this.currentIncidentId = this.incidentId;
        this.currentDepartmentId = this.departmentId;
        this.getActionableCount(this.currentIncidentId, this.currentDepartmentId);
        this.globalState.Subscribe('incidentChange', (model) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model) => this.departmentChangeHandler(model));

    }

    private incidentChangeHandler(incidentId): void {
        this.currentIncidentId = incidentId;
        this.getActionableCount(this.currentIncidentId, this.currentDepartmentId);
    };

    private departmentChangeHandler(departmentId): void {
        this.currentDepartmentId = departmentId;
        this.getActionableCount(this.currentIncidentId, this.currentDepartmentId);
    };

    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }
}