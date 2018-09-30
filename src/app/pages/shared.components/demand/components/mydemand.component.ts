import {
    Component, ViewEncapsulation, OnInit,
    ViewChild, OnDestroy, Injector
} from '@angular/core';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription, Subject, Observable } from 'rxjs/Rx';
import { DemandModel, DemandModelToView, DemandRemarkLogModel } from './demand.model';
import { DemandService } from './demand.service';
import { DemandRemarkLogService } from './demand.remarklogs.service';
import { DemandTrailService } from './demandtrail.service';
import { DemandTrailModel } from './demand.trail.model';
import * as moment from 'moment/moment';

import {
    ResponseModel, DataExchangeService, KeyValue,
    GlobalConstants, GlobalStateService,
    UtilityService, AuthModel
} from '../../../../shared';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'my-demand',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/mydemand.view.html'
})
export class MyDemandComponent implements OnInit, OnDestroy {
    @ViewChild('childModalRemarks') public childModalRemarks: ModalDirective;
    @ViewChild('childModalTrail') public childModalTrail: ModalDirective;

    mydemands: DemandModelToView[] = [];
    public currentDepartmentId: number;
    currentIncidentId: number;
    createdByName: string;
    createdBy: number;
    demandRemarks: DemandRemarkLogModel[] = [];
    Remarks: string;
    RemarkToCreate: DemandRemarkLogModel;
    demandTrails: DemandTrailModel[];
    demandForRemarks: DemandModelToView;
    demandTypeName: string = '';
    requesterDepartmentName: string = '';
    credential: AuthModel;
    protected _onRouteChange: Subscription;
    isArchive: boolean = false;
    demandFilePath: string;
    public globalStateProxy: GlobalStateService;
    public isInvalidRemarks: boolean = false;
    private ngUnsubscribe: Subject<any> = new Subject<any>();
    public isDashboradMyDemandDownloadLink: boolean = true;


    /**
     *Creates an instance of MyDemandComponent.
     * @param {DemandService} demandService
     * @param {DemandRemarkLogService} demandRemarkLogsService
     * @param {DataExchangeService<number>} dataExchange
     * @param {DemandTrailService} demandTrailService
     * @param {GlobalStateService} globalState
     * @param {ToastrService} toastrService
     * @param {ToastrConfig} toastrConfig
     * @param {Router} _router
     * @param {Injector} injector
     * @memberof MyDemandComponent
     */
    constructor(private demandService: DemandService,
        private demandRemarkLogsService: DemandRemarkLogService,
        private dataExchange: DataExchangeService<number>,
        private demandTrailService: DemandTrailService,
        private globalState: GlobalStateService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig, private _router: Router,
        private injector: Injector) {
        this.demandForRemarks = new DemandModelToView();
        this.mydemands = new Array<DemandModelToView>();
        this.demandFilePath = GlobalConstants.EXTERNAL_URL + 'api/FileDownload/GetFile/Demand/';
        this.globalStateProxy = injector.get(GlobalStateService);
    }

    public ngOnInit(): void {
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        if (this._router.url.indexOf('archivedashboard') > -1) {
            this.isArchive = true;
            this.currentIncidentId = +UtilityService.GetFromSession('ArchieveIncidentId');
        }
        else {
            this.isArchive = false;
            this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        }
        this.getMyDemands(this.currentDepartmentId, this.currentIncidentId);
        this.credential = UtilityService.getCredentialDetails();
        this.createdBy = +this.credential.UserId;
        this.createdByName = this.credential.UserName;
        this.Remarks = '';

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DemandAddedUpdated,
            (model) => this.demandUpdated(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard,
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard,
            (model: KeyValue) => this.departmentChangeHandler(model));

        // SignalR Notification
        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceiveDemandCreationResponse.Key, (model: DemandModel) => {
                // this.getMyDemands(model.RequesterDepartmentId, model.IncidentId);
                this.getMyDemands(this.currentDepartmentId, this.currentIncidentId);
            });

        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceiveDemandStatusUpdateResponse.Key, (model: DemandModel) => {
                // this.getMyDemands(model.RequesterDepartmentId, model.IncidentId);
                this.getMyDemands(this.currentDepartmentId, this.currentIncidentId);
            });
    }

    public ngAfterContentInit(): any {
        // this.setRagStatus();
        //UtilityService.SetRAGStatus(this.mydemands, 'Demand');
    }

    public getMyDemands(deptId, incidentId): void {
        this.mydemands.length = 0;
        this.demandService.GetByRequesterDepartment(deptId, incidentId)
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<DemandModel>) => {
                this.mydemands = this.demandService.DemandMapper(response.Records);
                this.mydemands.forEach((x) => {
                    const scheduleTime = x.ScheduleTime;
                    const createdOn = new Date(x.CreatedOn);
                    const timediff = createdOn.getTime() + (+scheduleTime) * 60000;
                    const resolutiontime = new Date(timediff);
                    x.ScheduleTimeToShow = moment(resolutiontime).format('DD-MMM-YYYY HH:mm');
                    x['showRemarks'] = false;
                    x.RagStatus = "";
                });

                UtilityService.SetRAGStatus(this.mydemands, 'Demand');

            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    public open(demandId): void {
        const num = UtilityService.UUID();
        this.globalStateProxy.NotifyDataChanged(GlobalConstants.DataExchangeConstant.OnDemandUpdate, demandId + '!' + num);
        //this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.OnDemandUpdate, demandId + '!' + num);
    }

    public getDemandRemarks(demandId): void {
        this.demandRemarkLogsService.GetDemandRemarksByDemandId(demandId)
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<DemandRemarkLogModel>) => {
                this.demandRemarks = response.Records;
                this.childModalRemarks.show();
            }, (error: any) => {
                console.log('error:  ' + error);
            });
    }

    public getDemandTrails(demandId): void {
        this.demandTrailService.getDemandTrailByDemandId(demandId)
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<DemandTrailModel>) => {
                this.demandTrails = response.Records;
                this.childModalTrail.show();
            }, (error: any) => {
                console.log('error:  ' + error);
            });
    }

    public cancelTrail(): void {
        this.childModalTrail.hide();
    }

    public openDemandRemarks(demand): void {
        this.demandForRemarks = demand;
        this.getDemandRemarks(demand.DemandId);
    }

    public cancelRemarkUpdate(demand): void {
        this.isInvalidRemarks = false;
        this.childModalRemarks.hide();
    }

    public saveRemark(remarks): void {
        if (remarks == '' || remarks == undefined) {
            this.isInvalidRemarks = true;
            return;
        }
        const demand = this.demandForRemarks;

        this.RemarkToCreate = new DemandRemarkLogModel();
        this.RemarkToCreate.Remark = remarks;
        this.RemarkToCreate.DemandId = demand.DemandId;
        this.RemarkToCreate.RequesterDepartmentName = demand.RequesterDepartmentName;
        this.RemarkToCreate.TargetDepartmentName = demand.TargetDepartmentName;
        this.RemarkToCreate.CreatedByName = this.createdByName;

        this.demandRemarkLogsService.Create(this.RemarkToCreate)
            .subscribe((response: DemandRemarkLogModel) => {
                this.toastrService.success('Remark saved successfully.', 'Success', this.toastrConfig);
                this.getDemandRemarks(demand.DemandId);
                this.Remarks = '';
            }, (error: any) => {
                console.log('error:  ' + error);
                alert('Error occured during saving the remark');
            });
    }

    public openTrail(demand: DemandModelToView): void {
        this.demandTypeName = demand.DemandTypeName;
        this.requesterDepartmentName = demand.RequesterDepartmentName;
        this.getDemandTrails(demand.DemandId);
    }

    public openDemandDetails(demandId: number): void {
        const num = UtilityService.UUID();
        this.globalStateProxy.NotifyDataChanged(GlobalConstants.DataExchangeConstant.OnDemandDetailClick, demandId + '!' + num);
    }

    public canceltrail(demand): void {
        demand['showTrails'] = false;
    }

    public ngOnDestroy(): void {
        //this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard);
        //this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard);
        //this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.DemandAddedUpdated);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getMyDemands(this.currentDepartmentId, this.currentIncidentId);
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getMyDemands(this.currentDepartmentId, this.currentIncidentId);
    }

    private demandUpdated(model): void {
        this.getMyDemands(this.currentDepartmentId, this.currentIncidentId);
    }
}