import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import {
    DemandRaisedSummaryModel,
    AllDemandRaisedSummaryModel,
    DemandRaisedModel,
    AllDeptDemandRaisedSummary,
    SubDeptDemandRaisedSummary
} from './demand.raised.summary.widget.model';
import { DemandRaisedSummaryWidgetService } from './demand.raised.summary.widget.service';
import { DemandModel } from '../../shared.components/demand/components/demand.model';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'demand-raised-summary-widget',
    templateUrl: './demand.raised.summary.widget.view.html',
    encapsulation: ViewEncapsulation.None
})
export class DemandRaisedSummaryWidgetComponent implements OnInit {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;
    @ViewChild('childModalAllDemandRaisedSummary') public childModalAllDemandRaisedSummary: ModalDirective;
    @ViewChild('childModalViewAllDemandRaisedSummary') public childModalViewAllDemandRaisedSummary: ModalDirective;
    @ViewChild('childModalViewAllSubDeptDemandRaisedSummary') public childModalViewAllSubDeptDemandRaisedSummary: ModalDirective;

    public allDemandRaisedSummaryModel: Observable<AllDemandRaisedSummaryModel[]>;
    public demandRaisedList: Observable<DemandRaisedSummaryModel[]>;
    public allDemandRaisedList: Observable<DemandRaisedModel[]>;
    public demandRaisedSummary: DemandRaisedSummaryModel;
    public allDemandRaisedSummaryModelList: AllDemandRaisedSummaryModel[];
    public showAllDeptSubCompleted: boolean;
    public showAllDeptSubPending: boolean;
    public showSubDeptSubCompleted: boolean;
    public showSubDeptSubPending: boolean;
    public allDeptDemandRaisedSummaries: AllDeptDemandRaisedSummary[];
    public subDeptDemandRaisedSummaries: AllDeptDemandRaisedSummary[];
    constructor(private demandRaisedSummaryWidgetService: DemandRaisedSummaryWidgetService) { }

    public ngOnInit(): void {
        this.demandRaisedSummary = new DemandRaisedSummaryModel();
        this.showAllDeptSubCompleted = false;
        this.showAllDeptSubPending = false;
        this.showSubDeptSubCompleted = false;
        this.showSubDeptSubPending = false;
        this.demandRaisedSummary = this.demandRaisedSummaryWidgetService.GetDemandRaisedCount(this.incidentId, this.departmentId);

    }

    public openAllocatedActionableDetails(): void {
        this.getOpenAllocatedDemandDetails(this.incidentId, this.departmentId, () => {
            this.childModalAllDemandRaisedSummary.show();
        });
    }

    public hideAllocatedActionableDetails(): void {
        this.childModalAllDemandRaisedSummary.hide();
    }

    public getOpenAllocatedDemandDetails(incidentId: number, departmentId: number, callback?: Function): void {
        this.demandRaisedSummaryWidgetService.GetAllDemandByTargetDepartment(this.incidentId, this.departmentId, (x: AllDemandRaisedSummaryModel[]) => {
            this.allDemandRaisedSummaryModelList = x;
            this.setRagStatus();
            debugger;
            this.allDemandRaisedSummaryModel = Observable.of(this.allDemandRaisedSummaryModelList);
            this.childModalAllDemandRaisedSummary.show();
        });
    }

    setRagStatus(): void {
        Observable.interval(1000).subscribe(_ => {
            this.allDemandRaisedSummaryModelList.forEach(demand => {
                if (demand.ClosedOn == undefined || demand.ClosedOn == null) {
                    let ScheduleTime: number = (Number(demand.ScheduleTime) * 60000);
                    let CreatedOn: number = new Date(demand.CreatedOn).getTime();
                    let CurrentTime: number = new Date().getTime();
                    let TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
                    let percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));
                    if (percentage < 50) {
                        demand.RagStatus = 'statusGreen';
                    } else if (percentage >= 100) {
                        demand.RagStatus = 'statusRed';
                    }
                    else {
                        demand.RagStatus = 'statusAmber';
                    }
                }
                else {
                    let ScheduleTime: number = (Number(demand.ScheduleTime) * 60000);
                    let CreatedOn: number = new Date(demand.CreatedOn).getTime();
                    let CurrentTime: number = new Date().getTime();
                    let TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
                    let percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));
                    if (percentage < 50) {
                        demand.RagStatus = 'statusGreen';
                    } else if (percentage >= 100) {
                        demand.RagStatus = 'statusRed';
                    }
                    else {
                        demand.RagStatus = 'statusAmber';
                    }
                }
            });
            this.allDemandRaisedSummaryModel = Observable.of(this.allDemandRaisedSummaryModelList);
        });
    }

    public openViewAllDemandRaisedSummary(): void {
        debugger;
        this.showAllDeptSubCompleted = false;
        this.showAllDeptSubPending = false;
        this.demandRaisedSummaryWidgetService.GetAllDepartmentDemandByIncident(this.incidentId, (item: DemandRaisedModel[]) => {
            this.allDemandRaisedList = Observable.of(item);
            this.childModalViewAllDemandRaisedSummary.show();
        });

    }

    public hideViewAllDemandRaisedSummary(): void {
        this.showAllDeptSubCompleted = false;
        this.showAllDeptSubPending = false;
        this.childModalViewAllDemandRaisedSummary.hide();
    }

    public openViewAllSubDeptDemandRaisedSummary(): void {
        debugger;
        this.demandRaisedSummaryWidgetService.GetSubDepartmentDemandByRaisedDepartment(this.incidentId, this.departmentId, (item: DemandRaisedModel[]) => {
            debugger;
            this.allDemandRaisedList = Observable.of([]);
            this.allDemandRaisedList = Observable.of(item);
            this.childModalViewAllSubDeptDemandRaisedSummary.show();
        });
    }

    public hideViewAllSubDeptDemandRaisedSummary(): void {
        this.showSubDeptSubCompleted = false;
        this.showSubDeptSubPending = false;
        this.childModalViewAllSubDeptDemandRaisedSummary.hide();
    }



    public showAllDeptSubCompletedFunc(demandModelList: DemandModel[]): void {
        debugger;
        this.allDeptDemandRaisedSummaries = [];
        demandModelList.forEach((item: DemandModel) => {
            debugger;
            if (item.IsClosed == true) {
                let allDeptDemandRaisedSummary: AllDeptDemandRaisedSummary = new AllDeptDemandRaisedSummary();
                allDeptDemandRaisedSummary.description = item.DemandDesc;
                allDeptDemandRaisedSummary.requesterDepartmentName = item.RequesterDepartment.DepartmentName;
                let ScheduleTime: number = (Number(item.ScheduleTime) * 60000);
                let CreatedOn: number = new Date(item.CreatedOn).getTime();
                allDeptDemandRaisedSummary.scheduleCloseTime = new Date(CreatedOn + ScheduleTime);
                allDeptDemandRaisedSummary.ScheduleTime = item.ScheduleTime;
                allDeptDemandRaisedSummary.CreatedOn = item.CreatedOn;
                this.allDeptDemandRaisedSummaries.push(allDeptDemandRaisedSummary);
            }

        });
        Observable.interval(1000).subscribe(_ => {
            this.allDeptDemandRaisedSummaries.forEach((dept: AllDeptDemandRaisedSummary) => {
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
        this.allDeptDemandRaisedSummaries = [];
        demandModelList.forEach((item: DemandModel) => {
            debugger;
            if (item.IsClosed == false) {
                let allDeptDemandRaisedSummary: AllDeptDemandRaisedSummary = new AllDeptDemandRaisedSummary();
                allDeptDemandRaisedSummary.description = item.DemandDesc;
                allDeptDemandRaisedSummary.requesterDepartmentName = item.RequesterDepartment.DepartmentName;
                let ScheduleTime: number = (Number(item.ScheduleTime) * 60000);
                let CreatedOn: number = new Date(item.CreatedOn).getTime();
                allDeptDemandRaisedSummary.scheduleCloseTime = new Date(CreatedOn + ScheduleTime);
                allDeptDemandRaisedSummary.ScheduleTime = item.ScheduleTime;
                allDeptDemandRaisedSummary.CreatedOn = item.CreatedOn;
                this.allDeptDemandRaisedSummaries.push(allDeptDemandRaisedSummary);
            }
        });

        Observable.interval(1000).subscribe(_ => {
            this.allDeptDemandRaisedSummaries.forEach((dept: AllDeptDemandRaisedSummary) => {
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
        debugger;
        debugger;
        this.subDeptDemandRaisedSummaries = [];
        demandModelList.forEach((item: DemandModel) => {
            debugger;
            if (item.IsClosed == true) {
                let subDeptDemandRaisedSummary: SubDeptDemandRaisedSummary = new SubDeptDemandRaisedSummary();
                subDeptDemandRaisedSummary.description = item.DemandDesc;
                subDeptDemandRaisedSummary.requesterDepartmentName = item.RequesterDepartment.DepartmentName;
                let ScheduleTime: number = (Number(item.ScheduleTime) * 60000);
                let CreatedOn: number = new Date(item.CreatedOn).getTime();
                subDeptDemandRaisedSummary.scheduleCloseTime = new Date(CreatedOn + ScheduleTime);
                subDeptDemandRaisedSummary.ScheduleTime = item.ScheduleTime;
                subDeptDemandRaisedSummary.CreatedOn = item.CreatedOn;
                this.subDeptDemandRaisedSummaries.push(subDeptDemandRaisedSummary);
            }

        });
        Observable.interval(1000).subscribe(_ => {
            this.subDeptDemandRaisedSummaries.forEach((dept: AllDeptDemandRaisedSummary) => {
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
        debugger;
        this.showSubDeptSubCompleted = false;
        this.showSubDeptSubPending = false;

    }

    public showSubDeptSubPendingFunc(demandModelList: DemandModel[]): void {
        debugger;
        debugger;
        debugger;
        this.subDeptDemandRaisedSummaries = [];
        demandModelList.forEach((item: DemandModel) => {
            debugger;
            if (item.IsClosed == false) {
                let subDeptDemandRaisedSummary: SubDeptDemandRaisedSummary = new SubDeptDemandRaisedSummary();
                subDeptDemandRaisedSummary.description = item.DemandDesc;
                subDeptDemandRaisedSummary.requesterDepartmentName = item.RequesterDepartment.DepartmentName;
                let ScheduleTime: number = (Number(item.ScheduleTime) * 60000);
                let CreatedOn: number = new Date(item.CreatedOn).getTime();
                subDeptDemandRaisedSummary.scheduleCloseTime = new Date(CreatedOn + ScheduleTime);
                subDeptDemandRaisedSummary.ScheduleTime = item.ScheduleTime;
                subDeptDemandRaisedSummary.CreatedOn = item.CreatedOn;
                this.subDeptDemandRaisedSummaries.push(subDeptDemandRaisedSummary);
            }

        });
        Observable.interval(1000).subscribe(_ => {
            this.subDeptDemandRaisedSummaries.forEach((dept: AllDeptDemandRaisedSummary) => {
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
        debugger;
        this.showSubDeptSubCompleted = false;
        this.showSubDeptSubPending = false;

    }
}