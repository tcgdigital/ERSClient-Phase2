import {
    Component, OnInit, ViewEncapsulation,
    Input, ViewChild, SimpleChange
} from '@angular/core';

import {
    DemandRaisedSummaryModel,
    AllDemandRaisedSummaryModel,
    DemandRaisedModel,
    AllDeptDemandRaisedSummary,
    SubDeptDemandRaisedSummary,
    GraphObject
} from './demand.raised.summary.widget.model';
import { WidgetUtilityService } from "../widget.utility";
import { UtilityService, GlobalConstants } from '../../../shared';
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
    public arrGraphData: GraphObject[];
    //public elapsedHourForGraph: number = GlobalConstants.ELAPSED_HOUR_COUNT_FOR_DEMAND_GRAPH_CREATION;
    public graphCategories: string[] = [];
    constructor(private demandRaisedSummaryWidgetService: DemandRaisedSummaryWidgetService) { }

    public ngOnInit(): void {
        this.arrGraphData = [];
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
            UtilityService.SetRAGStatusGrid(this.allDemandRaisedSummaryModelList, 'Demand');

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
                this.graphDataFormationForDemandRaisedSummeryWidget(item);
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

        UtilityService.SetRAGStatus(this.allDeptDemandRaisedSummaries, 'Demand');
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

        UtilityService.SetRAGStatus(this.allDeptDemandRaisedSummaries, 'Demand');
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
        UtilityService.SetRAGStatus(this.subDeptDemandRaisedSummaries, 'Demand');
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
        UtilityService.SetRAGStatus(this.subDeptDemandRaisedSummaries, 'Demand');
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

    public graphDataFormationForDemandRaisedSummeryWidget(entity: DemandRaisedModel[]): void {
        this.arrGraphData = [];
        entity.map((item: DemandRaisedModel) => {
            item.demandModelList.map((itemDemand: DemandModel) => {
                let graphObject: GraphObject = new GraphObject();
                graphObject.requesterDepartmentName = item.requesterDepartmentName;
                graphObject.requesterDepartmentId = item.departmentId;
                graphObject.isAssigned = true;
                if (itemDemand.ClosedOn != null) {
                    graphObject.isClosed = true;
                    graphObject.closedOn = new Date(itemDemand.ClosedOn);
                }
                else {
                    graphObject.isPending = true;
                }
                graphObject.CreatedOn = new Date(itemDemand.CreatedOn);
                this.arrGraphData.push(graphObject);
            });
        });
        this.GetDemandRaisedGraph(entity[0].departmentId);
    }

    public GetDemandRaisedGraph(requesterDepartmentId: number) {
        WidgetUtilityService.GetGraph(requesterDepartmentId,Highcharts,this.arrGraphData,'demand-raised-graph-container');
        this.showDemandRaisedGraph = true;
    }

    private activator<T>(type: { new (): T; }): T {
        return new type();
    }
}
