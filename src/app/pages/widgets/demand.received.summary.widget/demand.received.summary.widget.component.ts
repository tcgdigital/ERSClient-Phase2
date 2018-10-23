import {
    Component, OnInit, OnDestroy, ElementRef, AfterViewInit,
    ViewEncapsulation, Input, ViewChild, SimpleChange
} from '@angular/core';
import {
    ResponseModel, UtilityService,
    GlobalStateService, GlobalConstants
} from '../../../shared';
import { WidgetUtilityService } from '../widget.utility';
import {
    DemandReceivedSummaryModel,
    DemandReceivedModel,
    AllDeptDemandReceivedSummary,
    SubDeptDemandReceivedSummary
} from './demand.received.summary.widget.model';
import { IncidentModel, IncidentService } from '../../incident';
import {
    GraphObject
} from '../demand.raised.summary.widget/demand.raised.summary.widget.model';
import { DemandModel } from '../../shared.components/demand/components/demand.model';
import { DemandReceivedSummaryWidgetService } from './demand.received.summary.widget.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs/Rx';
import * as Highcharts from 'highcharts';
import { DemandStatusLogModel, DemandStatusLogService }
    from "../../shared.components/demandstatuslog";


@Component({
    selector: 'demand-received-summary-widget',
    templateUrl: './demand.received.summary.widget.view.html',
    encapsulation: ViewEncapsulation.None,
    providers: [IncidentService]
})
export class DemandReceivedSummaryWidgetComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input('currentIncidentId') incidentId: number;
    @Input('initiatedDepartmentId') initiatedDepartmentId: number;

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
    public arrGraphData: GraphObject[];
    public showDemandReceivedGraph: boolean = false;
    public showGraph: boolean = false;
    public isShow: boolean = true;
    public isShowViewAll: boolean = true;
    public isShowViewSub: boolean = true;
    public accessibilityErrorMessage: string = GlobalConstants.accessibilityErrorMessage;

    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private elementRef: ElementRef, private globalState: GlobalStateService,
        private demandReceivedSummaryWidgetService: DemandReceivedSummaryWidgetService,
        private incidentService: IncidentService,
        private demandStatusLogService: DemandStatusLogService) { }

    public ngOnInit(): void {
        this.showGraph = false;
        this.arrGraphData = [];
        this.demandReceivedSummary = new DemandReceivedSummaryModel();
        this.demandReceivedSummary = this.demandReceivedSummaryWidgetService
            .GetDemandReceivedCount(this.incidentId, this.initiatedDepartmentId);

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DemandAddedUpdated, () => this.onDemandAddedUpdatedSuccess());
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DemandApproved, () => this.onDemandAddedUpdatedSuccess());
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DemandAssigned, () => this.onDemandAddedUpdatedSuccess());
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DemandCompleted, () => this.onDemandAddedUpdatedSuccess());

        // SignalR Notification
        this.globalState.Subscribe(GlobalConstants.NotificationConstant.ReceiveDemandCreationResponse.Key, () => this.onDemandAddedUpdatedSuccess());
        this.globalState.Subscribe(GlobalConstants.NotificationConstant.ReceiveDemandApprovedResponse.Key, () => this.onDemandAddedUpdatedSuccess());
        this.globalState.Subscribe(GlobalConstants.NotificationConstant.ReceiveDemandAssignedResponse.Key, () => this.onDemandAddedUpdatedSuccess());
        this.globalState.Subscribe(GlobalConstants.NotificationConstant.ReceiveDemandClosedResponse.Key, () => this.onDemandAddedUpdatedSuccess());
        this.globalState.Subscribe(GlobalConstants.NotificationConstant.ReceiveCompletedDemandAssignedResponse.Key, () => this.onDemandAddedUpdatedSuccess());
        this.globalState.Subscribe(GlobalConstants.NotificationConstant.ReceiveCompletedDemandstoCloseResponse.Key, () => this.onDemandAddedUpdatedSuccess());
        this.globalState.Subscribe(GlobalConstants.NotificationConstant.ReceiveDemandRejectedFromApprovalResponse.Key, () => this.onDemandAddedUpdatedSuccess());
        this.globalState.Subscribe(GlobalConstants.NotificationConstant.ReceiveRejectedDemandsFromClosureResponse.Key, () => this.onDemandAddedUpdatedSuccess());
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public onDemandAddedUpdatedSuccess(): void {
        this.demandReceivedSummary = this.demandReceivedSummaryWidgetService
            .GetDemandReceivedCount(this.incidentId, this.initiatedDepartmentId);
    }

    public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        this.showGraph = false;
        if (changes['incidentId'] !== undefined && (changes['incidentId'].currentValue !==
            changes['incidentId'].previousValue) &&
            changes['incidentId'].previousValue !== undefined) {
            this.demandReceivedSummary = this.demandReceivedSummaryWidgetService.GetDemandReceivedCount(this.incidentId, this.initiatedDepartmentId);
        }
        if (changes['initiatedDepartmentId'] !== undefined && (changes['initiatedDepartmentId'].currentValue !==
            changes['initiatedDepartmentId'].previousValue) &&
            changes['initiatedDepartmentId'].previousValue !== undefined) {
            this.demandReceivedSummary = this.demandReceivedSummaryWidgetService.GetDemandReceivedCount(this.incidentId, this.initiatedDepartmentId);
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
                item = item.sort(function (a, b) { return (a.targetDepartmentName.toUpperCase() > b.targetDepartmentName.toUpperCase()) ? 1 : ((b.targetDepartmentName.toUpperCase() > a.targetDepartmentName.toUpperCase()) ? -1 : 0); });
                this.allDemandReceivedList = Observable.of(item);
                this.childModalViewAllDemandReceivedSummary.show();
                if (item.length > 0)
                    this.graphDataFormationForDemandReceivedSummeryWidget(item);
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
        this.demandReceivedSummaryWidgetService.GetSubDepartmentDemandByTargetDepartment
            (this.incidentId, this.initiatedDepartmentId, (item: DemandReceivedModel[]) => {
                item = item.sort(function (a, b) { return (a.targetDepartmentName.toUpperCase() > b.targetDepartmentName.toUpperCase()) ? 1 : ((b.targetDepartmentName.toUpperCase() > a.targetDepartmentName.toUpperCase()) ? -1 : 0); });
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

        UtilityService.SetRAGStatus(this.allDeptDemandReceivedSummaries, 'Demand');

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
            if (item.IsClosed === false && (item.DemandType.IsAutoApproved === true ||
                (item.DemandType.IsAutoApproved === false && item.IsApproved === true))) {

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

        UtilityService.SetRAGStatus(this.allDeptDemandReceivedSummaries, 'Demand');

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
                subDeptDemandReceivedSummary.requesterDepartmentName = item.RequesterDepartment.DepartmentName;
                const ScheduleTime: number = (Number(item.ScheduleTime) * 60000);
                const CreatedOn: number = new Date(item.CreatedOn).getTime();
                subDeptDemandReceivedSummary.scheduleCloseTime = new Date(CreatedOn + ScheduleTime);
                subDeptDemandReceivedSummary.ScheduleTime = item.ScheduleTime;
                subDeptDemandReceivedSummary.CreatedOn = item.CreatedOn;
                this.subDeptDemandReceivedSummaries.push(subDeptDemandReceivedSummary);
            }
        });

        UtilityService.SetRAGStatus(this.subDeptDemandReceivedSummaries, 'Demand');

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
            if (item.IsClosed === false && (item.DemandType.IsAutoApproved === true ||
                (item.DemandType.IsAutoApproved === false && item.IsApproved === true))) {
                const subDeptDemandReceivedSummary: SubDeptDemandReceivedSummary = new SubDeptDemandReceivedSummary();
                subDeptDemandReceivedSummary.description = item.DemandDesc;
                subDeptDemandReceivedSummary.requesterDepartmentName = item.RequesterDepartment.DepartmentName;
                const ScheduleTime: number = (Number(item.ScheduleTime) * 60000);
                const CreatedOn: number = new Date(item.CreatedOn).getTime();
                subDeptDemandReceivedSummary.scheduleCloseTime = new Date(CreatedOn + ScheduleTime);
                subDeptDemandReceivedSummary.ScheduleTime = item.ScheduleTime;
                subDeptDemandReceivedSummary.CreatedOn = item.CreatedOn;
                this.subDeptDemandReceivedSummaries.push(subDeptDemandReceivedSummary);
            }
        });

        UtilityService.SetRAGStatus(this.subDeptDemandReceivedSummaries, 'Demand');

        this.showSubDeptSubCompleted = false;
        this.showSubDeptSubPending = true;
    }

    public hideSubDeptSubPending(): void {
        this.showSubDeptSubCompleted = false;
        this.showSubDeptSubPending = false;
    }

    public onViewAllDemandReceivedShown($event: ModalDirective): void {
        jQuery('#demand-table tbody tr:nth-child(1)').addClass('bg-blue-color');
    }

    public graphDataFormationForDemandReceivedSummeryWidget(entity: DemandReceivedModel[]): void {
        this.arrGraphData = [];
        this.showGraph = false;
        if (entity.length > 0) {
            entity.map((item: DemandReceivedModel) => {
                item.demandModelList.map((itemDemand: DemandModel) => {
                    const graphObject: GraphObject = new GraphObject();
                    graphObject.requesterDepartmentName = item.targetDepartmentName;
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
            this.GetDemandReceivedGraph(entity[0].departmentId, null);
        }
    }

    public GetDemandReceivedGraph(targetDepartmentId: number, $event: any) {
        if ($event !== null) {
            const $currentRow: JQuery = jQuery($event.currentTarget);
            $currentRow.closest('tbody').find('tr').removeClass('bg-blue-color');
            $currentRow.closest('tr').addClass('bg-blue-color');
        }

        this.demandStatusLogService.GetAllByIncidentTargetDepartment(this.incidentId, targetDepartmentId)
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((demandStatusLogModels: ResponseModel<DemandStatusLogModel>) => {

                this.incidentService.GetIncidentById(this.incidentId)
                    // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe((incidentModel: IncidentModel) => {
                        WidgetUtilityService.GetGraphDemand(targetDepartmentId, Highcharts,
                            demandStatusLogModels.Records, 'demand-received-graph-container',
                            'Received', incidentModel.CreatedOn, 'TargetDepartment');
                        this.showDemandReceivedGraph = true;
                    }, (error: any) => {
                        console.log(`Error: ${error.message}`);
                    });
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }
}