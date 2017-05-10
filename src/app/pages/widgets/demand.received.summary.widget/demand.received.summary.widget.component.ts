import { Component, OnInit, ViewEncapsulation, Input, ViewChild , SimpleChange} from '@angular/core';

import {
    DemandReceivedSummaryModel,
    DemandReceivedModel,
    AllDeptDemandReceivedSummary,
    SubDeptDemandReceivedSummary
} from './demand.received.summary.widget.model';
import { DemandModel } from '../../shared.components/demand/components/demand.model';
import { DemandReceivedSummaryWidgetService } from './demand.received.summary.widget.service';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'demand-received-summary-widget',
    templateUrl: './demand.received.summary.widget.view.html',
    encapsulation: ViewEncapsulation.None
})
export class DemandReceivedSummaryWidgetComponent implements OnInit {
    @Input('currentIncidentId') incidentId: number;
    @Input('initiatedDepartmentId') departmentId: number;
    @ViewChild('childModalViewAllDemandReceivedSummary') public childModalViewAllDemandReceivedSummary: ModalDirective;
    @ViewChild('childModalViewAllSubDeptDemandReceivedSummary') public childModalViewAllSubDeptDemandReceivedSummary: ModalDirective;
    public demandReceivedSummary: DemandReceivedSummaryModel;
    public allDemandReceivedList: Observable<DemandReceivedModel[]>;
    public subDemandReceivedList: Observable<DemandReceivedModel[]>;
    public allDeptDemandReceivedSummaries: AllDeptDemandReceivedSummary[];
    public subDeptDemandReceivedSummaries: AllDeptDemandReceivedSummary[];
    public showAllDeptSubCompleted: boolean;
    public showAllDeptSubPending: boolean;
    public showSubDeptSubCompleted: boolean;
    public showSubDeptSubPending: boolean;

    constructor(private demandReceivedSummaryWidgetService: DemandReceivedSummaryWidgetService) { }

    public ngOnInit(): void {
        this.demandReceivedSummary = new DemandReceivedSummaryModel();
        this.demandReceivedSummary = this.demandReceivedSummaryWidgetService.GetDemandReceivedCount(this.incidentId, this.departmentId);
    }

    public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        if (changes['incidentId'] !== undefined && (changes['incidentId'].currentValue !==
            changes['incidentId'].previousValue) &&
            changes['incidentId'].previousValue !== undefined) {
            this.demandReceivedSummary = this.demandReceivedSummaryWidgetService.GetDemandReceivedCount(this.incidentId, this.departmentId);
        }
        if (changes['departmentId'] !== undefined && (changes['departmentId'].currentValue !==
            changes['departmentId'].previousValue) &&
            changes['departmentId'].previousValue !== undefined) {
            this.demandReceivedSummary = this.demandReceivedSummaryWidgetService.GetDemandReceivedCount(this.incidentId, this.departmentId);
        }
    }



    public openViewAllDemandReceivedSummary(): void {
        this.showAllDeptSubCompleted = false;
        this.showAllDeptSubPending = false;
        this.demandReceivedSummaryWidgetService.GetAllDepartmentDemandByIncident(this.incidentId, (item: DemandReceivedModel[]) => {
            this.allDemandReceivedList = Observable.of(item);
            this.childModalViewAllDemandReceivedSummary.show();
        });
    }

    public hideViewAllDemandReceivedSummary(): void {
        this.showAllDeptSubCompleted = false;
        this.showAllDeptSubPending = false;
        this.childModalViewAllDemandReceivedSummary.hide();
    }

    public openViewAllSubDeptDemandReceivedSummary(): void {
        this.showSubDeptSubCompleted = false;
        this.showSubDeptSubPending = false;
        this.demandReceivedSummaryWidgetService.GetSubDepartmentDemandByRequesterDepartment(this.incidentId, this.departmentId, (item: DemandReceivedModel[]) => {
            this.subDemandReceivedList = Observable.of(item);
            this.childModalViewAllSubDeptDemandReceivedSummary.show();
        });
    }

    public hideViewAllSubDeptDemandReceivedSummary(): void {
        this.showSubDeptSubCompleted = false;
        this.showSubDeptSubPending = false;
        this.childModalViewAllSubDeptDemandReceivedSummary.hide();
    }


    public showAllDeptSubCompletedFunc(demandModelList: DemandModel[]): void {
        this.allDeptDemandReceivedSummaries = [];
        demandModelList.forEach((item: DemandModel) => {
            if (item.IsClosed == true) {
                let allDeptDemandReceivedSummary: AllDeptDemandReceivedSummary = new AllDeptDemandReceivedSummary();
                allDeptDemandReceivedSummary.description = item.DemandDesc;
                allDeptDemandReceivedSummary.requesterDepartmentName = item.RequesterDepartment.DepartmentName;
                let ScheduleTime: number = (Number(item.ScheduleTime) * 60000);
                let CreatedOn: number = new Date(item.CreatedOn).getTime();
                allDeptDemandReceivedSummary.scheduleCloseTime = new Date(CreatedOn + ScheduleTime);
                allDeptDemandReceivedSummary.ScheduleTime = item.ScheduleTime;
                allDeptDemandReceivedSummary.CreatedOn = item.CreatedOn;
                this.allDeptDemandReceivedSummaries.push(allDeptDemandReceivedSummary);
            }

        });
        Observable.interval(1000).subscribe(_ => {
            this.allDeptDemandReceivedSummaries.forEach((dept: AllDeptDemandReceivedSummary) => {
                let ScheduleTime: number = (Number(dept.ScheduleTime) * 60000);
                let CreatedOn: number = new Date(dept.CreatedOn).getTime();
                let CurrentTime: number = new Date().getTime();
                let TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
                let percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));
                if (percentage < 50) {
                    dept.RagStatus = 'statusGreen';
                } else if (percentage >= 100) {
                    dept.RagStatus = 'statusRed';
                }
                else {
                    dept.RagStatus = 'statusAmber';
                }
            });
        });
        this.showAllDeptSubCompleted = true;
        this.showAllDeptSubPending = false;
    }

    public hideAllDeptSubCompleted(): void {
        this.showAllDeptSubCompleted = false;
        this.showAllDeptSubPending = false;

    }

    public showAllDeptSubPendingFunc(demandModelList: DemandModel[]): void {
        this.allDeptDemandReceivedSummaries = [];
        demandModelList.forEach((item: DemandModel) => {
            if (item.IsClosed == false) {
                let allDeptDemandReceivedSummary: AllDeptDemandReceivedSummary = new AllDeptDemandReceivedSummary();
                allDeptDemandReceivedSummary.description = item.DemandDesc;
                allDeptDemandReceivedSummary.requesterDepartmentName = item.RequesterDepartment.DepartmentName;
                let ScheduleTime: number = (Number(item.ScheduleTime) * 60000);
                let CreatedOn: number = new Date(item.CreatedOn).getTime();
                allDeptDemandReceivedSummary.scheduleCloseTime = new Date(CreatedOn + ScheduleTime);
                allDeptDemandReceivedSummary.ScheduleTime = item.ScheduleTime;
                allDeptDemandReceivedSummary.CreatedOn = item.CreatedOn;
                this.allDeptDemandReceivedSummaries.push(allDeptDemandReceivedSummary);
            }
        });

        Observable.interval(1000).subscribe(_ => {
            this.allDeptDemandReceivedSummaries.forEach((dept: AllDeptDemandReceivedSummary) => {
                let ScheduleTime: number = (Number(dept.ScheduleTime) * 60000);
                let CreatedOn: number = new Date(dept.CreatedOn).getTime();
                let CurrentTime: number = new Date().getTime();
                let TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
                let percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));
                if (percentage < 50) {
                    dept.RagStatus = 'statusGreen';
                } else if (percentage >= 100) {
                    dept.RagStatus = 'statusRed';
                }
                else {
                    dept.RagStatus = 'statusAmber';
                }
            });
        });

        this.showAllDeptSubPending = true;
        this.showAllDeptSubCompleted = false;
    }

    public hideAllDeptSubPending(): void {
        this.showAllDeptSubPending = false;
        this.showAllDeptSubCompleted = false;
    }

    /////////////


    public showSubDeptSubCompletedFunc(demandModelList: DemandModel[]): void {
        this.subDeptDemandReceivedSummaries = [];
        demandModelList.forEach((item: DemandModel) => {
            if (item.IsClosed == true) {
                let subDeptDemandReceivedSummary: SubDeptDemandReceivedSummary = new SubDeptDemandReceivedSummary();
                subDeptDemandReceivedSummary.description = item.DemandDesc;
                subDeptDemandReceivedSummary.requesterDepartmentName = item.TargetDepartment.DepartmentName;
                let ScheduleTime: number = (Number(item.ScheduleTime) * 60000);
                let CreatedOn: number = new Date(item.CreatedOn).getTime();
                subDeptDemandReceivedSummary.scheduleCloseTime = new Date(CreatedOn + ScheduleTime);
                subDeptDemandReceivedSummary.ScheduleTime = item.ScheduleTime;
                subDeptDemandReceivedSummary.CreatedOn = item.CreatedOn;
                this.subDeptDemandReceivedSummaries.push(subDeptDemandReceivedSummary);
            }

        });
        Observable.interval(1000).subscribe(_ => {
            this.subDeptDemandReceivedSummaries.forEach((dept: AllDeptDemandReceivedSummary) => {
                let ScheduleTime: number = (Number(dept.ScheduleTime) * 60000);
                let CreatedOn: number = new Date(dept.CreatedOn).getTime();
                let CurrentTime: number = new Date().getTime();
                let TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
                let percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));
                if (percentage < 50) {
                    dept.RagStatus = 'statusGreen';
                } else if (percentage >= 100) {
                    dept.RagStatus = 'statusRed';
                }
                else {
                    dept.RagStatus = 'statusAmber';
                }
            });
        });
        this.showSubDeptSubCompleted = true;
        this.showSubDeptSubPending = false;
    }

    public hideSubDeptSubCompleted(): void {
        this.showSubDeptSubCompleted = false;
        this.showSubDeptSubPending = false;

    }

    public showSubDeptSubPendingFunc(demandModelList: DemandModel[]): void {
        this.subDeptDemandReceivedSummaries = [];
        demandModelList.forEach((item: DemandModel) => {
            if (item.IsClosed == false) {
                let subDeptDemandReceivedSummary: SubDeptDemandReceivedSummary = new SubDeptDemandReceivedSummary();
                subDeptDemandReceivedSummary.description = item.DemandDesc;
                subDeptDemandReceivedSummary.requesterDepartmentName = item.TargetDepartment.DepartmentName;
                let ScheduleTime: number = (Number(item.ScheduleTime) * 60000);
                let CreatedOn: number = new Date(item.CreatedOn).getTime();
                subDeptDemandReceivedSummary.scheduleCloseTime = new Date(CreatedOn + ScheduleTime);
                subDeptDemandReceivedSummary.ScheduleTime = item.ScheduleTime;
                subDeptDemandReceivedSummary.CreatedOn = item.CreatedOn;
                this.subDeptDemandReceivedSummaries.push(subDeptDemandReceivedSummary);
            }

        });
        Observable.interval(1000).subscribe(_ => {
            this.subDeptDemandReceivedSummaries.forEach((dept: AllDeptDemandReceivedSummary) => {
                let ScheduleTime: number = (Number(dept.ScheduleTime) * 60000);
                let CreatedOn: number = new Date(dept.CreatedOn).getTime();
                let CurrentTime: number = new Date().getTime();
                let TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
                let percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));
                if (percentage < 50) {
                    dept.RagStatus = 'statusGreen';
                } else if (percentage >= 100) {
                    dept.RagStatus = 'statusRed';
                }
                else {
                    dept.RagStatus = 'statusAmber';
                }
            });
        });
        this.showSubDeptSubCompleted = false;
        this.showSubDeptSubPending = true;

    }

    public hideSubDeptSubPending(): void {
        this.showSubDeptSubCompleted = false;
        this.showSubDeptSubPending = false;

    }


}