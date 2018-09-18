import {
    Component, ViewEncapsulation, OnDestroy, OnInit, Input
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs/Rx';
import {
    FormGroup, FormControl, FormBuilder, Validators
} from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';

import { BroadCastModel } from './broadcast.model';
import { DepartmentBroadcastModel } from './departmentBroadcast.mode';
import {
    BroadCastDepartmentModel,
    BroadcastDepartmentService
} from '../../../masterdata/broadcastdepartment';
import { BroadcastService } from './broadcast.service';
import {
    DepartmentModel,
    DepartmentService
} from '../../../masterdata/department';
import {
    ResponseModel, DataExchangeService, KeyValue,
    GlobalConstants, UtilityService,
    GlobalStateService, AuthModel
} from '../../../../shared';

@Component({
    selector: 'broadcast-entry',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/broadcast.entry.view.html'
})
export class BroadcastEntryComponent implements OnInit, OnDestroy {
    @Input() initiatedDepartmentId: number;
    @Input() incidentId: number;

    public form: FormGroup;
    deptBrodCastModels: DepartmentBroadcastModel[] = null;
    deptBroadcast: DepartmentBroadcastModel;
    broadcast: BroadCastModel = new BroadCastModel();
    BroadCastDepartmentMappings: BroadCastDepartmentModel[] = [];
    currentDepartment: BroadCastDepartmentModel = new BroadCastDepartmentModel();
    Action: string;
    priorities: any[] = GlobalConstants.Priority;
    currentIncidentId: number;
    currentDepartmentId: number;
    buttonValue: string = '';
    showAdd: boolean;
    isDepartmentSelected: boolean;
    selectedcount: number;
    credential: AuthModel;
    protected _onRouteChange: Subscription;
    isArchive: boolean = false;
    IsAllSelected: boolean = false;
    hideMessageError: boolean = true;
    hideDeptError: boolean = true;

    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     * Creates an instance of BroadcastEntryComponent.
     * @param {BroadcastDepartmentService} broadcastDepartmentMappingService
     * @param {BroadcastService} broadcastService
     * @param {DataExchangeService<BroadCastModel>} dataExchange
     * @param {FormBuilder} builder
     *
     * @memberOf BroadcastEntryComponent
     */
    constructor(private broadcastDepartmentMappingService: BroadcastDepartmentService,
        private broadcastService: BroadcastService,
        private dataExchange: DataExchangeService<BroadCastModel>, private departmentService: DepartmentService,
        private builder: FormBuilder, private globalState: GlobalStateService, private toastrService: ToastrService,
        private toastrConfig: ToastrConfig, private _router: Router) {
        this.deptBrodCastModels = [];
        this.buttonValue = 'Add New Broadcast Message';
        this.showAdd = false;
        this.isDepartmentSelected = false;
        this.selectedcount = 0;
    }

    ngOnInit(): void {
        this.initiatedDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.incidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        this.currentIncidentId = this.incidentId;
        this.currentDepartmentId = this.initiatedDepartmentId;
        this.initiateForm();
        if (this._router.url.indexOf('archivedashboard') > -1) {
            this.isArchive = true;
            this.currentIncidentId = +UtilityService.GetFromSession('ArchieveIncidentId');
        }
        else {
            this.isArchive = false;
            this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        }

        this.getBroadcastDepartmentMappings(this.currentDepartmentId);
        this.credential = UtilityService.getCredentialDetails();

        this.broadcast.IsSubmitted = false;
        this.broadcast.Priority = this.priorities.find((x) => x.value === '1').caption;
        this.broadcast.DepartmentBroadcasts = [];
        this.Action = 'Save';

        this.dataExchange.Subscribe(GlobalConstants.DataExchangeConstant.OnBroadcastUpdate,
            (model: BroadCastModel) => this.onBroadcastUpdate(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard,
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard,
            (model: KeyValue) => this.departmentChangeHandler(model));
    }

    ngOnDestroy(): void {
        // this.dataExchange.Unsubscribe(GlobalConstants.DataExchangeConstant.OnBroadcastUpdate);
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard);
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard);

        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    initiateForm(): void {
        this.form = new FormGroup({
            BroadcastId: new FormControl(0),
            Message: new FormControl('', [Validators.required]),
            SelectAllDepartment: new FormControl(0),
            BroadCastDepartmentMappings: new FormControl(0),
            Priority: new FormControl('', [Validators.required])
        });
    }

    selectAllDepartment(IsAllSelected: boolean): void {
        this.broadcast.DepartmentBroadcasts = [];
        this.BroadCastDepartmentMappings.forEach((element) => {
            element.IsSelected = IsAllSelected;
            if (IsAllSelected) {
                this.deptBroadcast = new DepartmentBroadcastModel();
                this.deptBroadcast.DepartmentId = element.TargetDepartmentId;
                this.broadcast.DepartmentBroadcasts.push(this.deptBroadcast);
            }
            else {
                this.broadcast.DepartmentBroadcasts = [];
                this.selectedcount = 0;
            }
        });
        this.selectedcount = this.broadcast.DepartmentBroadcasts.length;
    }

    selectDepartment(event, department: BroadCastDepartmentModel): void {
        this.BroadCastDepartmentMappings.forEach((item) => {
            if (item.TargetDepartmentId === department.TargetDepartmentId) {
                item.IsSelected = event.target.checked;
            }
        });
        this.selectedcount = this.BroadCastDepartmentMappings.filter((x) => x.IsSelected === true).length;
        if (this.selectedcount === this.BroadCastDepartmentMappings.length) {
            this.IsAllSelected = true;
        }
        else {
            this.IsAllSelected = false;
        }
    }

    save(isSubmitted: boolean): void {
        if (this.form.valid) {
            if (this.broadcast.Message == null || this.broadcast.Message === '' || this.broadcast.Message === undefined) {
                this.hideMessageError = false;
            }
            else if (this.selectedcount <= 0) {
                this.hideMessageError = true;
                this.hideDeptError = false;
            }

            else {
                this.hideMessageError = true;
                this.hideDeptError = true;
                this.broadcast.IsSubmitted = isSubmitted;
                if (isSubmitted) {
                    this.broadcast.SubmittedOn = new Date();
                }
                this.broadcast.DepartmentBroadcasts = [];

                this.BroadCastDepartmentMappings.forEach((item) => {
                    if (item.IsSelected) {
                        this.deptBroadcast = new DepartmentBroadcastModel();
                        if (this.broadcast.BroadcastId !== 0) {
                            this.deptBroadcast.BroadcastId = this.broadcast.BroadcastId;
                        }
                        this.deptBroadcast.DepartmentId = item.TargetDepartmentId;
                        this.broadcast.DepartmentBroadcasts.push(this.deptBroadcast);
                    }
                });
                this.CreateOrUpdateBroadcast();
            }
        }
    }

    CreateOrUpdateBroadcast(): void {
        if (this.form.valid) {
            UtilityService.setModelFromFormGroup<BroadCastModel>(this.broadcast, this.form,
                (x) => x.BroadcastId, (x) => x.Message, (x) => x.Priority);
            this.broadcast.IncidentId = this.currentIncidentId;
            this.broadcast.InitiateDepartmentId = this.currentDepartmentId;

            if (this.broadcast.BroadcastId === 0) {
                this.broadcast.CreatedBy = +this.credential.UserId;

                this.broadcastService.Create(this.broadcast)
                    .subscribe((response: BroadCastModel) => {
                        this.toastrService.success('Broadcast saved successfully.', 'Success', this.toastrConfig);
                        this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.BroadcastModelSaved, response);

                        if (this.broadcast.IsSubmitted) {
                            this.globalState.NotifyDataChanged(GlobalConstants.DataExchangeConstant.BroadcastPublished, response);
                        }
                        this.cancel();
                        this.IsAllSelected = false;
                    }, (error: any) => {
                        console.log(`Error: ${error.message}`);
                    });
            }
            else {
                this.broadcastService.Create(this.broadcast)
                    .subscribe((response: BroadCastModel) => {
                        this.toastrService.success('Broadcast edited successfully.', 'Success', this.toastrConfig);

                        this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.BroadcastModelUpdated, response);
                        if (this.broadcast.IsSubmitted) {
                            this.globalState.NotifyDataChanged(GlobalConstants.DataExchangeConstant.BroadcastPublished, this.broadcast);
                        }
                        this.cancel();
                        this.IsAllSelected = false;
                    }, (error: any) => {
                        console.log(`Error: ${error.message}`);
                    });
            }
        }
    }

    onBroadcastUpdate(broadcastModel: BroadCastModel): void {
        this.hideMessageError = true;
        this.hideDeptError = true;
        this.broadcast = broadcastModel;
        this.broadcast.IncidentId = this.currentIncidentId;
        this.broadcast.IsUpdated = true;
        this.showAdd = true;

        this.BroadCastDepartmentMappings.forEach((item) => {
            item.IsSelected = this.broadcast.DepartmentBroadcasts
                .some((x) => x.DepartmentId === item.TargetDepartmentId);
        });
        this.selectedcount = this.BroadCastDepartmentMappings.filter((x) => x.IsSelected === true).length;
        if (this.selectedcount === this.BroadCastDepartmentMappings.length) {
            this.IsAllSelected = true;
        }
        else {
            this.IsAllSelected = false;
        }
    }

    cancel(): void {
        this.hideMessageError = true;
        this.hideDeptError = true;
        this.broadcast = new BroadCastModel();
        this.broadcast.DepartmentBroadcasts = [];
        this.showAdd = false;
        this.initiateForm();
        this.BroadCastDepartmentMappings.forEach((a) => {
            a.IsSelected = false;
        });
        this.broadcast.Priority = this.priorities.find((x) => x.value === '1').caption;
    }

    showAddRegion(ShowAdd: boolean): void {
        this.showAdd = true;
        this.isDepartmentSelected = false;
        this.IsAllSelected = false;
        this.selectedcount = 0;
    }

    showList = function (e) {
        this.isDepartmentSelected = !this.isDepartmentSelected;
    };

    showList1 = function (e) {
        this.isDepartmentSelected = false;
    };

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getBroadcastDepartmentMappings(this.currentDepartmentId);
    }

    private getBroadcastDepartmentMappings(departmentId): void {
        this.broadcastDepartmentMappingService.Query(departmentId)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<BroadCastDepartmentModel>) => {
                const broadcastmappingIds: number[] = this.BroadCastDepartmentMappings
                    .map((item) => item.BroadcastDepartmentMappingId);
                this.BroadCastDepartmentMappings = response.Records;
                this.BroadCastDepartmentMappings.forEach((element) => {
                    element.IsSelected = false;
                });
                this.currentDepartment.TargetDepartmentId = departmentId;
                this.currentDepartment.BroadcastDepartmentMappingId = Math.max.apply(Math, broadcastmappingIds) + 1;
                this.currentDepartment.TargetDepartment = new DepartmentModel();
                this.currentDepartment.TargetDepartment.DepartmentId = departmentId;

                this.departmentService.Get(departmentId)
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe((response1: DepartmentModel) => {
                        this.currentDepartment.TargetDepartment.DepartmentName = response1.DepartmentName;
                    }, (error: any) => {
                        console.log(`Error: ${error.message}`);
                    });

                this.BroadCastDepartmentMappings.push(this.currentDepartment);
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }
}