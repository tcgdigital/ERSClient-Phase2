import {
    Component, OnInit, ElementRef, AfterViewInit,
    ViewEncapsulation, Input, ViewChild, SimpleChange
} from '@angular/core';
import { UtilityService } from '../../../shared';
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
import * as Highcharts from 'highcharts';

@Component({
    selector: 'demand-received-summary-widget',
    templateUrl: './demand.received.summary.widget.view.html',
    encapsulation: ViewEncapsulation.None
})
export class DemandReceivedSummaryWidgetComponent implements OnInit, AfterViewInit {
    @Input('currentIncidentId') incidentId: number;
    @Input('initiatedDepartmentId') departmentId: number;

    @ViewChild('childModalViewAllDemandReceivedSummary')
    public childModalViewAllDemandReceivedSummary: ModalDirective;

    @ViewChild('childModalViewAllSubDeptDemandReceivedSummary')
    public childModalViewAllSubDeptDemandReceivedSummary: ModalDirective;

    public demandReceivedSummary: DemandReceivedSummaryModel;
    public allDemandReceivedList: Observable<DemandReceivedModel[]>;
    public subDemandReceivedList: Observable<DemandReceivedModel[]>;
    public allDeptDemandReceivedSummaries: AllDeptDemandReceivedSummary[];
    public subDeptDemandReceivedSummaries: AllDeptDemandReceivedSummary[];
    public showAllDeptSubCompleted: boolean;
    public showAllDeptSubPending: boolean;
    public showSubDeptSubCompleted: boolean;
    public showSubDeptSubPending: boolean;
    public baseLocationURl: string = window.location.pathname;
    public hasDemandReceivedList: boolean = false;
    private $selfElement: JQuery;
    private $placeholder: JQuery;

    constructor(private elementRef: ElementRef,
        private demandReceivedSummaryWidgetService: DemandReceivedSummaryWidgetService) { }

    public ngOnInit(): void {
        this.demandReceivedSummary = new DemandReceivedSummaryModel();
        this.demandReceivedSummary = this.demandReceivedSummaryWidgetService
            .GetDemandReceivedCount(this.incidentId, this.departmentId);
        this.setDemandReceivedGraphData();
    }

    public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        if(changes['incidentId'] !== undefined && (changes['incidentId'].currentValue !==
            changes['incidentId'].previousValue) &&
            changes['incidentId'].previousValue !== undefined){
        this.demandReceivedSummary = this.demandReceivedSummaryWidgetService.GetDemandReceivedCount(this.incidentId, this.departmentId);
        }
        if(changes['departmentId'] !== undefined && (changes['departmentId'].currentValue !==
            changes['departmentId'].previousValue) &&
            changes['departmentId'].previousValue !== undefined){
        this.demandReceivedSummary = this.demandReceivedSummaryWidgetService.GetDemandReceivedCount(this.incidentId, this.departmentId);
        }
    }

    public ngAfterViewInit(): void {

    }

    // TODO: Need to refactor
    public openViewAllDemandReceivedSummary(): void {
        this.showAllDeptSubCompleted = false;
        this.showAllDeptSubPending = false;
        this.demandReceivedSummaryWidgetService.GetAllDepartmentDemandByIncident
            (this.incidentId, (item: DemandReceivedModel[]) => {
                this.allDemandReceivedList = Observable.of(item);
                this.childModalViewAllDemandReceivedSummary.show();
                // this.hasDemandReceivedList = item.length > 0;
                // this.setDemandReceivedGraphData();
            });
    }

    public hideViewAllDemandReceivedSummary(): void {
        this.showAllDeptSubCompleted = false;
        this.showAllDeptSubPending = false;
        this.childModalViewAllDemandReceivedSummary.hide();
    }

    // TODO: Need to refactor
    public openViewAllSubDeptDemandReceivedSummary(): void {
        this.showSubDeptSubCompleted = false;
        this.showSubDeptSubPending = false;
        this.demandReceivedSummaryWidgetService.GetSubDepartmentDemandByRequesterDepartment
            (this.incidentId, this.departmentId, (item: DemandReceivedModel[]) => {
                this.subDemandReceivedList = Observable.of(item);
                this.childModalViewAllSubDeptDemandReceivedSummary.show();
            });
    }

    public hideViewAllSubDeptDemandReceivedSummary(): void {
        this.showSubDeptSubCompleted = false;
        this.showSubDeptSubPending = false;
        this.childModalViewAllSubDeptDemandReceivedSummary.hide();
    }

    // TODO: Need to refactor
    public showAllDeptSubCompletedFunc(demandModelList: DemandModel[]): void {
        this.allDeptDemandReceivedSummaries = [];
        demandModelList.forEach((item: DemandModel) => {
            if (item.IsClosed === true) {
                const allDeptDemandReceivedSummary: AllDeptDemandReceivedSummary = new AllDeptDemandReceivedSummary();
                allDeptDemandReceivedSummary.description = item.DemandDesc;
                allDeptDemandReceivedSummary.requesterDepartmentName = item.RequesterDepartment.DepartmentName;
                const ScheduleTime: number = (Number(item.ScheduleTime) * 60000);
                const CreatedOn: number = new Date(item.CreatedOn).getTime();
                allDeptDemandReceivedSummary.scheduleCloseTime = new Date(CreatedOn + ScheduleTime);
                allDeptDemandReceivedSummary.ScheduleTime = item.ScheduleTime;
                allDeptDemandReceivedSummary.CreatedOn = item.CreatedOn;
                this.allDeptDemandReceivedSummaries.push(allDeptDemandReceivedSummary);
            }

        });

        UtilityService.SetRAGStatus(this.allDeptDemandReceivedSummaries,'Demand');
        this.showAllDeptSubCompleted = true;
        this.showAllDeptSubPending = false;
    }

    public hideAllDeptSubCompleted(): void {
        this.showAllDeptSubCompleted = false;
        this.showAllDeptSubPending = false;

    }

    // TODO: Need to refactor
    public showAllDeptSubPendingFunc(demandModelList: DemandModel[]): void {
        this.allDeptDemandReceivedSummaries = [];
        demandModelList.forEach((item: DemandModel) => {
            if (item.IsClosed === false) {
                const allDeptDemandReceivedSummary: AllDeptDemandReceivedSummary = new AllDeptDemandReceivedSummary();
                allDeptDemandReceivedSummary.description = item.DemandDesc;
                allDeptDemandReceivedSummary.requesterDepartmentName = item.RequesterDepartment.DepartmentName;
                const ScheduleTime: number = (Number(item.ScheduleTime) * 60000);
                const CreatedOn: number = new Date(item.CreatedOn).getTime();
                allDeptDemandReceivedSummary.scheduleCloseTime = new Date(CreatedOn + ScheduleTime);
                allDeptDemandReceivedSummary.ScheduleTime = item.ScheduleTime;
                allDeptDemandReceivedSummary.CreatedOn = item.CreatedOn;
                this.allDeptDemandReceivedSummaries.push(allDeptDemandReceivedSummary);
            }
        });

        UtilityService.SetRAGStatus(this.allDeptDemandReceivedSummaries,'Demand');

        this.showAllDeptSubPending = true;

        this.showAllDeptSubCompleted = false;
    }

    public hideAllDeptSubPending(): void {
        this.showAllDeptSubPending = false;
        this.showAllDeptSubCompleted = false;
    }

    // TODO: Need to refactor
    public showSubDeptSubCompletedFunc(demandModelList: DemandModel[]): void {
        this.subDeptDemandReceivedSummaries = [];
        demandModelList.forEach((item: DemandModel) => {
            if (item.IsClosed === true) {
                const subDeptDemandReceivedSummary: SubDeptDemandReceivedSummary = new SubDeptDemandReceivedSummary();
                subDeptDemandReceivedSummary.description = item.DemandDesc;
                subDeptDemandReceivedSummary.requesterDepartmentName = item.TargetDepartment.DepartmentName;
                const ScheduleTime: number = (Number(item.ScheduleTime) * 60000);
                const CreatedOn: number = new Date(item.CreatedOn).getTime();
                subDeptDemandReceivedSummary.scheduleCloseTime = new Date(CreatedOn + ScheduleTime);
                subDeptDemandReceivedSummary.ScheduleTime = item.ScheduleTime;
                subDeptDemandReceivedSummary.CreatedOn = item.CreatedOn;
                this.subDeptDemandReceivedSummaries.push(subDeptDemandReceivedSummary);
            }
        });

        UtilityService.SetRAGStatus(this.subDeptDemandReceivedSummaries,'Demand');
        this.showSubDeptSubCompleted = true;
        this.showSubDeptSubPending = false;
    }

    public hideSubDeptSubCompleted(): void {
        this.showSubDeptSubCompleted = false;
        this.showSubDeptSubPending = false;

    }

    // TODO: Need to refactor
    public showSubDeptSubPendingFunc(demandModelList: DemandModel[]): void {
        this.subDeptDemandReceivedSummaries = [];
        demandModelList.forEach((item: DemandModel) => {
            if (item.IsClosed === false) {
                const subDeptDemandReceivedSummary: SubDeptDemandReceivedSummary = new SubDeptDemandReceivedSummary();
                subDeptDemandReceivedSummary.description = item.DemandDesc;
                subDeptDemandReceivedSummary.requesterDepartmentName = item.TargetDepartment.DepartmentName;
                const ScheduleTime: number = (Number(item.ScheduleTime) * 60000);
                const CreatedOn: number = new Date(item.CreatedOn).getTime();
                subDeptDemandReceivedSummary.scheduleCloseTime = new Date(CreatedOn + ScheduleTime);
                subDeptDemandReceivedSummary.ScheduleTime = item.ScheduleTime;
                subDeptDemandReceivedSummary.CreatedOn = item.CreatedOn;
                this.subDeptDemandReceivedSummaries.push(subDeptDemandReceivedSummary);
            }

        });

        UtilityService.SetRAGStatus(this.subDeptDemandReceivedSummaries,'Demand');
        this.showSubDeptSubCompleted = false;
        this.showSubDeptSubPending = true;
    }

    public hideSubDeptSubPending(): void {
        this.showSubDeptSubCompleted = false;
        this.showSubDeptSubPending = false;
    }

    private setDemandReceivedGraphData(): void {
        Highcharts.chart('demand-received-graph-container', {
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