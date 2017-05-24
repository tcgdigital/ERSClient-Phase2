import {
    Component, OnInit, ViewEncapsulation,
    Input, ViewChild, SimpleChange
} from '@angular/core';

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
import * as Highcharts from 'highcharts';

@Component({
    selector: 'demand-raised-summary-widget',
    templateUrl: './demand.raised.summary.widget.view.html',
    encapsulation: ViewEncapsulation.None
})
export class DemandRaisedSummaryWidgetComponent implements OnInit {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;

    @ViewChild('childModalAllDemandRaisedSummary')
    public childModalAllDemandRaisedSummary: ModalDirective;

    @ViewChild('childModalViewAllDemandRaisedSummary')
    public childModalViewAllDemandRaisedSummary: ModalDirective;

    @ViewChild('childModalViewAllSubDeptDemandRaisedSummary')
    public childModalViewAllSubDeptDemandRaisedSummary: ModalDirective;

    public allDemandRaisedSummaryModel: Observable<AllDemandRaisedSummaryModel[]>;
    public demandRaisedList: Observable<DemandRaisedSummaryModel[]>;
    public allDemandRaisedList: Observable<DemandRaisedModel[]>;
    public allSubDeptDemandRaisedList: Observable<DemandRaisedModel[]>;
    public demandRaisedSummary: DemandRaisedSummaryModel;
    public allDemandRaisedSummaryModelList: AllDemandRaisedSummaryModel[];
    public showAllDeptSubCompleted: boolean;
    public showAllDeptSubPending: boolean;
    public showSubDeptSubCompleted: boolean;
    public showSubDeptSubPending: boolean;
    public allDeptDemandRaisedSummaries: AllDeptDemandRaisedSummary[];
    public subDeptDemandRaisedSummaries: AllDeptDemandRaisedSummary[];
    public baseLocationURl: string = window.location.pathname;
    public showDemandRaisedGraph: boolean = false;

    constructor(private demandRaisedSummaryWidgetService: DemandRaisedSummaryWidgetService) { }

    public ngOnInit(): void {
        this.demandRaisedSummary = new DemandRaisedSummaryModel();
        this.showAllDeptSubCompleted = false;
        this.showAllDeptSubPending = false;
        this.showSubDeptSubCompleted = false;
        this.showSubDeptSubPending = false;
        this.demandRaisedSummary = this.demandRaisedSummaryWidgetService
            .GetDemandRaisedCount(this.incidentId, this.departmentId);
    }

    public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        if (changes['incidentId'] !== undefined
            && (changes['incidentId'].currentValue !== changes['incidentId'].previousValue)
            && changes['incidentId'].previousValue !== undefined) {
            this.demandRaisedSummary = this.demandRaisedSummaryWidgetService
                .GetDemandRaisedCount(this.incidentId, this.departmentId);
        }
        if (changes['departmentId'] !== undefined
            && (changes['departmentId'].currentValue !== changes['departmentId'].previousValue)
            && changes['departmentId'].previousValue !== undefined) {
            this.demandRaisedSummary = this.demandRaisedSummaryWidgetService
                .GetDemandRaisedCount(this.incidentId, this.departmentId);
        }
    }

    public openAllocatedActionableDetails(): void {
        this.getOpenAllocatedDemandDetails(this.incidentId, this.departmentId, () => {
            this.childModalAllDemandRaisedSummary.show();
        });
    }

    public hideAllocatedActionableDetails(): void {
        this.childModalAllDemandRaisedSummary.hide();
    }

    public getOpenAllocatedDemandDetails(incidentId: number, departmentId: number, callback?: () => void): void {
        this.demandRaisedSummaryWidgetService.GetAllDemandByRequesterDepartment
            (this.incidentId, this.departmentId, (x: AllDemandRaisedSummaryModel[]) => {
                this.allDemandRaisedSummaryModelList = x;
                this.setRagStatus();
                this.allDemandRaisedSummaryModel = Observable.of(this.allDemandRaisedSummaryModelList);
                this.childModalAllDemandRaisedSummary.show();
            });
    }

    // TODO: Need to refactor
    setRagStatus(): void {
        Observable.interval(1000).subscribe((_) => {
            this.allDemandRaisedSummaryModelList.forEach((demand) => {
                if (demand.ClosedOn === undefined || demand.ClosedOn == null) {
                    const ScheduleTime: number = (Number(demand.ScheduleTime) * 60000);
                    const CreatedOn: number = new Date(demand.CreatedOn).getTime();
                    const CurrentTime: number = new Date().getTime();
                    const TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
                    const percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));

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
                    const ScheduleTime: number = (Number(demand.ScheduleTime) * 60000);
                    const CreatedOn: number = new Date(demand.CreatedOn).getTime();
                    const CurrentTime: number = new Date().getTime();
                    const TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
                    const percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));
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

    // TODO: Need to refactor
    public openViewAllDemandRaisedSummary(): void {
        this.showAllDeptSubCompleted = false;
        this.showAllDeptSubPending = false;
        this.demandRaisedSummaryWidgetService.GetAllDepartmentDemandByIncident
            (this.incidentId, (item: DemandRaisedModel[]) => {
                this.allDemandRaisedList = Observable.of(item);
                this.childModalViewAllDemandRaisedSummary.show();
                // this.hasDemandRaisedList = item.length > 0;
                // this.setDemandRaisedGraphData();
            });
    }

    public hideViewAllDemandRaisedSummary(): void {
        this.showAllDeptSubCompleted = false;
        this.showAllDeptSubPending = false;
        this.childModalViewAllDemandRaisedSummary.hide();
    }

    // TODO: Need to refactor
    public openViewAllSubDeptDemandRaisedSummary(): void {
        this.demandRaisedSummaryWidgetService.GetSubDepartmentDemandByRaisedDepartment
            (this.incidentId, this.departmentId, (item: DemandRaisedModel[]) => {
                this.allSubDeptDemandRaisedList = Observable.of([]);
                this.allSubDeptDemandRaisedList = Observable.of(item);
                this.childModalViewAllSubDeptDemandRaisedSummary.show();
            });
    }

    public hideViewAllSubDeptDemandRaisedSummary(): void {
        this.showSubDeptSubCompleted = false;
        this.showSubDeptSubPending = false;
        this.childModalViewAllSubDeptDemandRaisedSummary.hide();
    }

    // TODO: Need to refactor
    public showAllDeptSubCompletedFunc(demandModelList: DemandModel[]): void {
        this.allDeptDemandRaisedSummaries = [];
        demandModelList.forEach((item: DemandModel) => {
            if (item.IsClosed === true) {
                const allDeptDemandRaisedSummary: AllDeptDemandRaisedSummary = new AllDeptDemandRaisedSummary();
                allDeptDemandRaisedSummary.description = item.DemandDesc;
                allDeptDemandRaisedSummary.targetDepartmentName = item.TargetDepartment.DepartmentName;
                const ScheduleTime: number = (Number(item.ScheduleTime) * 60000);
                const CreatedOn: number = new Date(item.CreatedOn).getTime();
                allDeptDemandRaisedSummary.scheduleCloseTime = new Date(CreatedOn + ScheduleTime);
                allDeptDemandRaisedSummary.ScheduleTime = item.ScheduleTime;
                allDeptDemandRaisedSummary.CreatedOn = item.CreatedOn;
                this.allDeptDemandRaisedSummaries.push(allDeptDemandRaisedSummary);
            }
        });
        Observable.interval(1000).subscribe((_) => {
            this.allDeptDemandRaisedSummaries.forEach((dept: AllDeptDemandRaisedSummary) => {
                const ScheduleTime: number = (Number(dept.ScheduleTime) * 60000);
                const CreatedOn: number = new Date(dept.CreatedOn).getTime();
                const CurrentTime: number = new Date().getTime();
                const TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
                const percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));

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

    // TODO: Need to refactor
    public showAllDeptSubPendingFunc(demandModelList: DemandModel[]): void {
        this.allDeptDemandRaisedSummaries = [];
        demandModelList.forEach((item: DemandModel) => {
            if (item.IsClosed === false) {
                const allDeptDemandRaisedSummary: AllDeptDemandRaisedSummary = new AllDeptDemandRaisedSummary();
                allDeptDemandRaisedSummary.description = item.DemandDesc;
                allDeptDemandRaisedSummary.targetDepartmentName = item.TargetDepartment.DepartmentName;
                const ScheduleTime: number = (Number(item.ScheduleTime) * 60000);
                const CreatedOn: number = new Date(item.CreatedOn).getTime();
                allDeptDemandRaisedSummary.scheduleCloseTime = new Date(CreatedOn + ScheduleTime);
                allDeptDemandRaisedSummary.ScheduleTime = item.ScheduleTime;
                allDeptDemandRaisedSummary.CreatedOn = item.CreatedOn;
                this.allDeptDemandRaisedSummaries.push(allDeptDemandRaisedSummary);
            }
        });

        Observable.interval(1000).subscribe((_) => {
            this.allDeptDemandRaisedSummaries.forEach((dept: AllDeptDemandRaisedSummary) => {
                const ScheduleTime: number = (Number(dept.ScheduleTime) * 60000);
                const CreatedOn: number = new Date(dept.CreatedOn).getTime();
                const CurrentTime: number = new Date().getTime();
                const TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
                const percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));

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

    // TODO: Need to refactor
    public showSubDeptSubCompletedFunc(demandModelList: DemandModel[]): void {
        this.subDeptDemandRaisedSummaries = [];
        demandModelList.forEach((item: DemandModel) => {
            if (item.IsClosed === true) {
                const subDeptDemandRaisedSummary: SubDeptDemandRaisedSummary = new SubDeptDemandRaisedSummary();
                subDeptDemandRaisedSummary.description = item.DemandDesc;
                subDeptDemandRaisedSummary.targetDepartmentName = item.TargetDepartment.DepartmentName;
                const ScheduleTime: number = (Number(item.ScheduleTime) * 60000);
                const CreatedOn: number = new Date(item.CreatedOn).getTime();
                subDeptDemandRaisedSummary.scheduleCloseTime = new Date(CreatedOn + ScheduleTime);
                subDeptDemandRaisedSummary.ScheduleTime = item.ScheduleTime;
                subDeptDemandRaisedSummary.CreatedOn = item.CreatedOn;
                this.subDeptDemandRaisedSummaries.push(subDeptDemandRaisedSummary);
            }
        });
        Observable.interval(1000).subscribe((_) => {
            this.subDeptDemandRaisedSummaries.forEach((dept: AllDeptDemandRaisedSummary) => {
                const ScheduleTime: number = (Number(dept.ScheduleTime) * 60000);
                const CreatedOn: number = new Date(dept.CreatedOn).getTime();
                const CurrentTime: number = new Date().getTime();
                const TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
                const percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));

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

    // TODO: Need to refactor
    public showSubDeptSubPendingFunc(demandModelList: DemandModel[]): void {
        this.subDeptDemandRaisedSummaries = [];
        demandModelList.forEach((item: DemandModel) => {
            if (item.IsClosed === false) {
                const subDeptDemandRaisedSummary: SubDeptDemandRaisedSummary = new SubDeptDemandRaisedSummary();
                subDeptDemandRaisedSummary.description = item.DemandDesc;
                subDeptDemandRaisedSummary.targetDepartmentName = item.TargetDepartment.DepartmentName;
                const ScheduleTime: number = (Number(item.ScheduleTime) * 60000);
                const CreatedOn: number = new Date(item.CreatedOn).getTime();
                subDeptDemandRaisedSummary.scheduleCloseTime = new Date(CreatedOn + ScheduleTime);
                subDeptDemandRaisedSummary.ScheduleTime = item.ScheduleTime;
                subDeptDemandRaisedSummary.CreatedOn = item.CreatedOn;
                this.subDeptDemandRaisedSummaries.push(subDeptDemandRaisedSummary);
            }
        });
        Observable.interval(1000).subscribe((_) => {
            this.subDeptDemandRaisedSummaries.forEach((dept: AllDeptDemandRaisedSummary) => {
                const ScheduleTime: number = (Number(dept.ScheduleTime) * 60000);
                const CreatedOn: number = new Date(dept.CreatedOn).getTime();
                const CurrentTime: number = new Date().getTime();
                const TimeDiffofCurrentMinusCreated: number = (CurrentTime - CreatedOn);
                const percentage: number = (((TimeDiffofCurrentMinusCreated) * 100) / (ScheduleTime));

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

    // TODO: Need to refactor
    public hideSubDeptSubPending(): void {
        this.showSubDeptSubCompleted = false;
        this.showSubDeptSubPending = false;
    }

    // TODO: Need to refactor (Not needed)
    public hideSubDeptSubCompleted(): void {
        this.showSubDeptSubCompleted = false;
        this.showSubDeptSubPending = false;
    }

    public GetDemandRaisedGraph($event, requesterDepartmentId) {
        console.log(requesterDepartmentId);
    }

    private setDemandRaisedGraphData(): void {
        Highcharts.chart('demand-raised-graph-container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Monthly Average Rainfall'
            },
            subtitle: {
                text: 'Source: WorldClimate.com'
            },
            xAxis: {
                categories: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Rainfall (mm)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Tokyo',
                data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

            }, {
                name: 'New York',
                data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
            }]
        });
    }
}
