import {
    Component, OnInit, OnDestroy, ViewEncapsulation,
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
import { WidgetUtilityService } from '../widget.utility';
import {
    ResponseModel, UtilityService, GlobalConstants,
    DataExchangeService, GlobalStateService
} from '../../../shared';
import { DemandRaisedSummaryWidgetService } from './demand.raised.summary.widget.service';
import { DemandModel } from '../../shared.components/demand/components/demand.model';
import { IncidentModel, IncidentService } from '../../incident';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs/Rx';
import * as Highcharts from 'highcharts';
import { DemandStatusLogModel, DemandStatusLogService } from "../../shared.components/demandstatuslog";

@Component({
    selector: 'demand-raised-summary-widget',
    templateUrl: './demand.raised.summary.widget.view.html',
    encapsulation: ViewEncapsulation.None,
    providers: [IncidentService]
})
export class DemandRaisedSummaryWidgetComponent implements OnInit, OnDestroy {
    @Input('initiatedDepartmentId') initiatedDepartmentId: number;
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
    public showGraph: boolean = false;
    public isShow: boolean = true;
    public isShowViewAll: boolean = true;
    public isShowViewSub: boolean = true;
    public accessibilityErrorMessage: string = GlobalConstants.accessibilityErrorMessage;
    public graphCategories: string[] = [];

    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private demandRaisedSummaryWidgetService: DemandRaisedSummaryWidgetService,
        private incidentService: IncidentService, private globalState: GlobalStateService,
        private dataExchange: DataExchangeService<DemandModel>,
        private demandStatusLogService: DemandStatusLogService) { }

    public ngOnInit(): void {
        this.showGraph = false;
        this.arrGraphData = [];
        this.demandRaisedSummary = new DemandRaisedSummaryModel();
        this.showAllDeptSubCompleted = false;
        this.showAllDeptSubPending = false;
        this.showSubDeptSubCompleted = false;
        this.showSubDeptSubPending = false;
        this.demandRaisedSummary = this.demandRaisedSummaryWidgetService
            .GetDemandRaisedCount(this.incidentId, this.initiatedDepartmentId);

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DemandAddedUpdated, () => this.onDemandAddedUpdatedSuccess());
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DemandApproved, () => this.onDemandAddedUpdatedSuccess());
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DemandAssigned, () => this.onDemandAddedUpdatedSuccess());
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DemandCompleted, () => this.onDemandAddedUpdatedSuccess());

        // SignalR Notification
        this.globalState.Subscribe(GlobalConstants.NotificationConstant.ReceiveDemandCreationResponse.Key, () => this.onDemandAddedUpdatedSuccess());
        this.globalState.Subscribe(GlobalConstants.NotificationConstant.ReceiveDemandApprovedResponse.Key, () => this.onDemandAddedUpdatedSuccess());
        this.globalState.Subscribe(GlobalConstants.NotificationConstant.ReceiveDemandAssignedResponse.Key, () => this.onDemandAddedUpdatedSuccess());
        this.globalState.Subscribe(GlobalConstants.NotificationConstant.ReceiveDemandClosedResponse.Key, () => this.onDemandAddedUpdatedSuccess());
        this.globalState.Subscribe(GlobalConstants.NotificationConstant.ReceiveCompletedDemandstoCloseResponse.Key, () => this.onDemandAddedUpdatedSuccess());
        this.globalState.Subscribe(GlobalConstants.NotificationConstant.ReceiveDemandRejectedFromApprovalResponse.Key, () => this.onDemandAddedUpdatedSuccess());
        this.globalState.Subscribe(GlobalConstants.NotificationConstant.ReceiveRejectedDemandsFromClosureResponse.Key, () => this.onDemandAddedUpdatedSuccess());
    }

    public onDemandAddedUpdatedSuccess(): void {
        this.demandRaisedSummary = this.demandRaisedSummaryWidgetService
            .GetDemandRaisedCount(this.incidentId, this.initiatedDepartmentId);
    }

    public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        this.showGraph = false;
        if (changes['incidentId'] !== undefined
            && (changes['incidentId'].currentValue !== changes['incidentId'].previousValue)
            && changes['incidentId'].previousValue !== undefined) {
            this.demandRaisedSummary = this.demandRaisedSummaryWidgetService
                .GetDemandRaisedCount(this.incidentId, this.initiatedDepartmentId);
        }
        if (changes['initiatedDepartmentId'] !== undefined
            && (changes['initiatedDepartmentId'].currentValue !== changes['initiatedDepartmentId'].previousValue)
            && changes['initiatedDepartmentId'].previousValue !== undefined) {
            this.demandRaisedSummary = this.demandRaisedSummaryWidgetService
                .GetDemandRaisedCount(this.incidentId, this.initiatedDepartmentId);
        }
    }

    public openAllocatedActionableDetails(): void {
        this.getOpenAllocatedDemandDetails(this.incidentId, this.initiatedDepartmentId, () => {
            this.childModalAllDemandRaisedSummary.show();
        });
    }

    public hideAllocatedActionableDetails(): void {
        this.childModalAllDemandRaisedSummary.hide();
    }

    public getOpenAllocatedDemandDetails(incidentId: number, departmentId: number, callback?: () => void): void {
        this.demandRaisedSummaryWidgetService.GetAllDemandByRequesterDepartment
            (this.incidentId, this.initiatedDepartmentId, (x: AllDemandRaisedSummaryModel[]) => {
                this.allDemandRaisedSummaryModelList = x;
                this.allDemandRaisedSummaryModel = Observable.of(this.allDemandRaisedSummaryModelList);
                this.setRagStatus();
                //this.childModalAllDemandRaisedSummary.show();
                if (callback) {
                    callback();
                }
            });
    }

    // TODO: Need to refactor
    setRagStatus(): void {
        // UtilityService.SetRAGStatusGrid(this.allDemandRaisedSummaryModelList, 'Demand');
        UtilityService.SetRAGStatus(this.allDemandRaisedSummaryModelList, 'Demand');
    }

    // TODO: Need to refactor
    public openViewAllDemandRaisedSummary(): void {
        this.showAllDeptSubCompleted = false;
        this.showAllDeptSubPending = false;
        this.demandRaisedSummaryWidgetService.GetAllDepartmentDemandByIncident
            (this.incidentId, (item: DemandRaisedModel[]) => {
                item = item.sort(function (a, b) { return (a.requesterDepartmentName.toUpperCase() > b.requesterDepartmentName.toUpperCase()) ? 1 : ((b.requesterDepartmentName.toUpperCase() > a.requesterDepartmentName.toUpperCase()) ? -1 : 0); });
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
            (this.incidentId, this.initiatedDepartmentId, (item: DemandRaisedModel[]) => {
                this.allSubDeptDemandRaisedList = Observable.of([]);
                item = item.sort(function (a, b) { return (a.requesterDepartmentName.toUpperCase() > b.requesterDepartmentName.toUpperCase()) ? 1 : ((b.requesterDepartmentName.toUpperCase() > a.requesterDepartmentName.toUpperCase()) ? -1 : 0); });
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
                allDeptDemandRaisedSummary.DemandStatusDescription = item.DemandStatusDescription;

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


    public onViewAllDemandRaisedShown($event: ModalDirective): void {
        jQuery('#demand-table tbody tr:nth-child(1)').addClass('bg-blue-color');
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
                subDeptDemandRaisedSummary.DemandStatusDescription = item.DemandStatusDescription;
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
                subDeptDemandRaisedSummary.DemandStatusDescription = item.DemandStatusDescription;
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
        this.showGraph = false;
        if (entity.length > 0) {
            entity.map((item: DemandRaisedModel) => {
                item.demandModelList.map((itemDemand: DemandModel) => {
                    const graphObject: GraphObject = new GraphObject();
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
            this.showGraph = true;
            this.GetDemandRaisedGraph(entity[0].departmentId, null);
        }
    }

    public GetDemandRaisedGraph(requesterDepartmentId: number, $event: any) {
        if ($event !== null) {
            const $currentRow: JQuery = jQuery($event.currentTarget);
            $currentRow.closest('tbody').find('tr').removeClass('bg-blue-color');
            $currentRow.closest('tr').addClass('bg-blue-color');
        }

        this.demandStatusLogService.GetAllByIncidentRequesterDepartment(this.incidentId, requesterDepartmentId)
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((demandStatusLogModels: ResponseModel<DemandStatusLogModel>) => {

                this.incidentService.GetIncidentById(this.incidentId)
                    .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe((incidentModel: IncidentModel) => {
                        WidgetUtilityService.GetGraphDemand(requesterDepartmentId, Highcharts, demandStatusLogModels.Records,
                            'demand-raised-graph-container', 'Raised', incidentModel.CreatedOn, 'RequesterDepartment');
                        this.showDemandRaisedGraph = true;
                    }, (error: any) => {
                        console.log(`Error: ${error.message}`);
                    });
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    ngOnDestroy(): void {
        // this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.DemandAddedUpdated);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private activator<T>(type: { new(): T; }): T {
        return new type();
    }
}
