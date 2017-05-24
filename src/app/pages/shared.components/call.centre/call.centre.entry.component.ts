import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, Observable } from 'rxjs/Rx';


import {
    ResponseModel, DataExchangeService,
    AutocompleteComponent, KeyValue,
    GlobalConstants, UtilityService, GlobalStateService, AuthModel
} from '../../../shared';
import { EnquiryModel, EnquiryService } from './components';

import {
    CommunicationLogModel, InvolvePartyModel,
    AffectedPeopleService, AffectedPeopleToView,
    AffectedObjectsService, AffectedObjectsToView, DemandModel
} from '../../shared.components';
import { DemandService } from '../demand';
import { CommunicationLogService } from '../communicationlogs';
import { CallerModel } from '../caller';
import { DepartmentService, DepartmentModel } from '../../masterdata/department';
import { InvolvePartyService } from '../involveparties';
import {
    CallCenterOnlyPageService, ExternalInputModel,
    PDAEnquiryModel, CargoEnquiryModel, MediaAndOtherQueryModel
} from '../../callcenteronlypage/component';

import { IAutocompleteActions } from '../../../shared/components/autocomplete/IAutocompleteActions';

@Component({
    selector: 'call-centre-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/call.centre.view.html',
    styleUrls: ['./styles/call.center.style.scss'],
    providers: [
        EnquiryService,
        AffectedPeopleService,
        AffectedObjectsService,
        DepartmentService,
        DemandService,
        InvolvePartyService,
        CommunicationLogService
    ]
})
export class EnquiryEntryComponent /*implements OnInit*/ {
    @Input('callid') callid: number;
    @Input('enquiryType') enquiryType: number;



    /**
     * Creates an instance of EnquiryEntryComponent.
     * @param {AffectedPeopleService} affectedPeopleService
     * @param {AffectedObjectsService} affectedObjectsService
     * @param {DepartmentService} departmentService
     * @param {EnquiryService} enquiryService
     * @param {InvolvePartyService} involvedPartyService
     * @param {DemandService} demandService
     * @param {DataExchangeService<string>} dataExchange
     * @param {GlobalStateService} globalState
     * 
     * @memberOf EnquiryEntryComponent
     */
    constructor(private affectedPeopleService: AffectedPeopleService,
        private affectedObjectsService: AffectedObjectsService,
        private departmentService: DepartmentService,
        private enquiryService: EnquiryService,
        private involvedPartyService: InvolvePartyService,
        private demandService: DemandService,
        private dataExchange: DataExchangeService<string>,
        private globalState: GlobalStateService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private callcenteronlypageservice: CallCenterOnlyPageService,
        private communicationlogservice: CommunicationLogService) { }


    public form: FormGroup;
    enquiryTypes: any[] = GlobalConstants.ExternalInputEnquiryType;
    pdaenquery: PDAEnquiryModel = new PDAEnquiryModel();
    cargoquery: CargoEnquiryModel = new CargoEnquiryModel();
    otherquery: MediaAndOtherQueryModel = new MediaAndOtherQueryModel();
    //enquiryType: number;
    enquiry: EnquiryModel = new EnquiryModel();
    enquiryToUpdate: EnquiryModel = new EnquiryModel();
    caller: CallerModel = new CallerModel();
    passengers: KeyValue[] = [];
    awbs: KeyValue[] = [];
    crews: KeyValue[] = [];
    affectedPeople: AffectedPeopleToView[];
    communicationLogs: CommunicationLogModel[];
    communicationLog: CommunicationLogModel = new CommunicationLogModel();
    date: Date = new Date();
    demand: DemandModel;
    demands: DemandModel[] = new Array<DemandModel>();
    affectedObjects: AffectedObjectsToView[];
    currentDepartmentId: number;
    currentDepartmentName: string = 'Command Centre';
    currentIncident: number;
    departments: DepartmentModel[];
    selctedEnquiredPerson: AffectedPeopleToView;
    selctedEnquiredObject: AffectedObjectsToView;
    credential: AuthModel;
    isCallrecieved: boolean = false;
    initialvalue: KeyValue = new KeyValue('', 0);
    actionLinks: IAutocompleteActions[] = [{
        ActionName: 'Test1',
        ActionDescription: 'Test Icon 1',
        ActionIcon: 'fa fa-comments-o fa-lg'
    }, {
        ActionName: 'Test2',
        ActionDescription: 'Test Icon 1',
        ActionIcon: 'fa fa-coffee fa-lg'
    }];

    protected _onRouteChange: Subscription;
    externalInput: ExternalInputModel = new ExternalInputModel();
    communicationlogtoupdateId: number;
    communicationlog: CommunicationLogModel = new CommunicationLogModel();



    onNotifyPassenger(message: KeyValue): void {
        this.enquiry.AffectedPersonId = message.Value;
        this.enquiry.AffectedObjectId = 0;
        this.communicationLog.AffectedPersonId = message.Value;
        delete this.communicationLog.AffectedObjectId;
        delete this.enquiry.AffectedObjectId;
    }

    onNotifyCrew(message: KeyValue): void {
        this.enquiry.AffectedPersonId = message.Value;
        this.enquiry.AffectedObjectId = 0;
        this.communicationLog.AffectedPersonId = message.Value;
        delete this.communicationLog.AffectedObjectId;
    }

    onNotifyCargo(message: KeyValue): void {
        this.enquiry.AffectedObjectId = message.Value;
        this.enquiry.AffectedPersonId = 0;
        this.communicationLog.AffectedObjectId = message.Value;
        delete this.communicationLog.AffectedPersonId;
    }

    iscrew(item: AffectedPeopleToView): any {
        return item.IsCrew === true;
    }

    ispassenger(item: AffectedPeopleToView): any {
        return item.IsCrew === false;
    }

    getPassengersCrews(currentIncident): void {
        this.involvedPartyService.GetFilterByIncidentId(currentIncident)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedPeople = this.affectedPeopleService.FlattenAffectedPeople(response.Records[0]);
                const passengerModels = this.affectedPeople.filter(this.ispassenger);
                const crewModels = this.affectedPeople.filter(this.iscrew);
                for (const affectedPerson of passengerModels) {
                    this.passengers.push(new KeyValue((affectedPerson.PassengerName || affectedPerson.CrewName), affectedPerson.AffectedPersonId));
                }
                for (const affectedPerson of crewModels) {
                    this.crews.push(new KeyValue((affectedPerson.PassengerName || affectedPerson.CrewName), affectedPerson.AffectedPersonId));
                }
            }, (error: any) => {
                console.log(`Error: ${error}`);
            }, () => {
                this.getExternalInput(this.enquiryType);
            });
    }

    getCargo(currentIncident): void {
        this.affectedObjectsService.GetFilterByIncidentId(currentIncident)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedObjects = this.affectedObjectsService.FlattenAffactedObjects(response.Records[0]);
                for (const affectedObject of this.affectedObjects) {
                    this.awbs.push(new KeyValue(affectedObject.AWB, affectedObject.AffectedObjectId));
                }
            }, (error: any) => {
                console.log(`Error: ${error}`);
            }, () => {
                this.getExternalInput(this.enquiryType);
            });
    }

    getDepartments(): void {
        this.departmentService.GetAll()
            .subscribe((response: ResponseModel<DepartmentModel>) => {
                this.departments = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    getExternalInput(enquirytype): void {
        let queryDetailService: Observable<ExternalInputModel[]>
        if (enquirytype == 1 || enquirytype == 3)
            queryDetailService = this.callcenteronlypageservice.GetPassengerQueryByIncident(this.currentIncident, this.callid).map(x => x.Records);
        else if (enquirytype == 2)
            queryDetailService = this.callcenteronlypageservice.GetCargoQueryByIncident(this.currentIncident, this.callid).map(x => x.Records);
        else if (enquirytype >= 4)
            queryDetailService = this.callcenteronlypageservice.GetMediaAndOtherQueryByIncident(this.currentIncident, this.callid).map(x => x.Records);

        queryDetailService.subscribe((response: ExternalInputModel[]) => {
            if (response[0].PDAEnquiry != null) {
                this.pdaenquery = response[0].PDAEnquiry;
                this.form.controls["Queries"].reset({ value: this.pdaenquery.Query, disabled: false });

            }
            if (response[0].CargoEnquiry != null) {
                this.cargoquery = response[0].CargoEnquiry;
                this.form.controls["Queries"].reset({ value: this.cargoquery.Query, disabled: false });
            }
            if (response[0].MediaAndOtherQuery != null) {
                this.otherquery = response[0].MediaAndOtherQuery;
                this.form.controls["Queries"].reset({ value: this.otherquery.Query, disabled: false });
            }
            this.enquiry.CallerId = response[0].Caller.CallerId;
            this.caller = response[0].Caller;
            this.isCallrecieved = response[0].IsCallRecieved;
            if (this.isCallrecieved) {
                this.enquiryToUpdate = response[0].Enquiries[0];
                this.enquiry = response[0].Enquiries[0];
                this.form.controls["Queries"].reset({ value: this.enquiryToUpdate.Queries, disabled: false });
                if (this.enquiryType == 1 || this.enquiryType == 2 || this.enquiryType == 3) {
                    this.form.controls["IsCallBack"].reset({ value: this.enquiryToUpdate.IsCallBack, disabled: false });
                    this.form.controls["IsAdminRequest"].reset({ value: this.enquiryToUpdate.IsAdminRequest, disabled: false });
                    this.form.controls["IsTravelRequest"].reset({ value: this.enquiryToUpdate.IsTravelRequest, disabled: false });
                    this.initialvalue = (this.enquiryType == 1) ? this.passengers.find(x => x.Value == this.enquiryToUpdate.AffectedPersonId)
                        : (this.enquiryType == 3 ? this.crews.find(x => x.Value == this.enquiryToUpdate.AffectedPersonId) :
                            (this.enquiryType == 2 ? this.awbs.find(x => x.Value == this.enquiryToUpdate.AffectedObjectId) : new KeyValue("", 0)));
                    this.communicationlogtoupdateId = this.enquiryToUpdate.CommunicationLogs[0].InteractionDetailsId;
                }
            }
        });

    }

    SetCommunicationLog(requestertype, interactionType): CommunicationLogModel[] {
        this.communicationLogs = new Array<CommunicationLogModel>();
        this.communicationLog.InteractionDetailsId = 0;
        this.communicationLog.InteractionDetailsType = interactionType;
        this.communicationLog.Answers = this.form.controls['Queries'].value + ' Caller:'
            + this.caller.CallerName + ' Contact Number:' + this.caller.ContactNumber;
        this.communicationLog.RequesterName = this.credential.UserName;
        this.communicationLog.RequesterDepartment = this.currentDepartmentName;
        this.communicationLog.RequesterType = requestertype;
        this.communicationLog.CreatedBy = +this.credential.UserId;
        this.communicationLogs.push(this.communicationLog);
        return this.communicationLogs;
    }

    SetDemands(isCallback, isTravelRequest, isAdmin, isCrew): void {
        if (isCallback || isCrew || isTravelRequest || isAdmin) {
            this.demand = new DemandModel();
            const type = isCallback ? 'Call Back' : (isTravelRequest ? 'Travel' : (isAdmin ? 'Admin' : 'Crew'));
            const scheduleTime = isCallback ? GlobalConstants.ScheduleTimeForCallback : (isTravelRequest ? GlobalConstants.ScheduleTimeForTravel
                : (isAdmin ? GlobalConstants.ScheduleTimeForAdmin : GlobalConstants.ScheduleTimeForDemandForCrew));
            this.demand.AffectedPersonId = (this.enquiryType == 1 || this.enquiryType == 3) ?
                this.enquiry.AffectedPersonId : 0;
            this.demand.AffectedObjectId = (this.enquiryType == 2) ?
                this.enquiry.AffectedObjectId : 0;
            this.selctedEnquiredPerson = (this.demand.AffectedPersonId !== 0) ?
                this.affectedPeople.find((x) => x.AffectedPersonId === this.demand.AffectedPersonId) : null;
            this.selctedEnquiredObject = (this.demand.AffectedObjectId !== 0) ?
                this.affectedObjects.find((x) => x.AffectedObjectId === this.demand.AffectedObjectId) : null;
            const personName = (this.selctedEnquiredPerson !== null) ? (this.enquiryType == 1 ?
                this.selctedEnquiredPerson.PassengerName : this.selctedEnquiredPerson.CrewName) : '';
            this.demand = new DemandModel();
            this.demand.AffectedPersonId = (this.enquiryType == 1 || this.enquiryType == 3) ?
                this.enquiry.AffectedPersonId : null;
            this.demand.AffectedObjectId = (this.enquiryType == 2) ?
                this.enquiry.AffectedObjectId : null;
            this.demand.AffectedId = (this.enquiryType == 1 || this.enquiryType == 3) ?
                this.affectedPeople.find((x) => x.AffectedPersonId === this.demand.AffectedPersonId).AffectedId :
                ((this.enquiryType == 2) ? this.affectedObjects.find((x) => x.AffectedObjectId === this.demand.AffectedObjectId).AffectedId : 0);
            this.demand.AWB = (this.enquiryType == 2) ?
                this.affectedObjects.find((x) => x.AffectedObjectId === this.demand.AffectedObjectId).AWB : null;
            this.demand.ContactNumber = this.caller.ContactNumber;
            this.demand.TargetDepartmentId = isCallback ? this.currentDepartmentId : (isTravelRequest ? GlobalConstants.TargetDepartmentTravel
                : (isAdmin ? GlobalConstants.TargetDepartmentAdmin : GlobalConstants.TargetDepartmentCrew));
            this.demand.RequesterDepartmentId = this.currentDepartmentId;
            this.demand.RequesterParentDepartmentId = this.departments.find((x) => x.DepartmentId === this.currentDepartmentId).ParentDepartmentId;
            this.demand.DemandCode = 'DEM-' + UtilityService.UUID();
            this.demand.DemandDesc = (this.enquiryType == 1 || this.enquiryType == 3) ?
                (type + ' Requested for ' + personName + ' (' + this.selctedEnquiredPerson.TicketNumber + ')') : (type + ' Requested for ' + this.selctedEnquiredObject.AWB + ' (' + this.selctedEnquiredObject.TicketNumber + ')');
            this.demand.DemandStatusDescription = 'New request by ' + this.currentDepartmentName;
            this.demand.DemandTypeId = GlobalConstants.DemandTypeId;
            this.demand.CallerId = this.caller.CallerId;
            this.demand.IncidentId = this.currentIncident;
            this.demand.IsApproved = true;
            this.demand.IsClosed = false;
            this.demand.IsCompleted = false;
            this.demand.IsRejected = false;
            this.demand.PDATicketNumber = (this.selctedEnquiredPerson !== null) ? this.selctedEnquiredPerson.TicketNumber
                : (this.selctedEnquiredObject != null ? this.selctedEnquiredObject.TicketNumber : null);
            this.demand.Priority = GlobalConstants.Priority.find((x) => x.value === '1').caption;
            this.demand.RequestedBy = this.credential.UserName;
            this.demand.CreatedBy = +this.credential.UserId;
            this.demand.RequiredLocation = GlobalConstants.RequiredLocation;
            this.demand.ScheduleTime = scheduleTime.toString();
            this.demand.RequesterType = GlobalConstants.RequesterTypeDemand;
            this.demand.CommunicationLogs = this.SetCommunicationLog(GlobalConstants.RequesterTypeDemand, GlobalConstants.InteractionDetailsTypeDemand);
            this.demands.push(this.demand);
        }
    }

    saveEnquiryDemandCaller(): void {
        UtilityService.setModelFromFormGroup<EnquiryModel>(this.enquiry, this.form,
            (x) => x.IsAdminRequest, (x) => x.IsCallBack, (x) => x.IsTravelRequest, (x) => x.Queries);

        this.demands = new Array<DemandModel>();

        let communicationlogs = this.SetCommunicationLog(GlobalConstants.RequesterTypeEnquiry, GlobalConstants.InteractionDetailsTypeEnquiry);
        if (!this.isCallrecieved) {
            this.enquiry.IncidentId = this.currentIncident;
            this.enquiry.Remarks = '';
            this.enquiry.CreatedBy = +this.credential.UserId;
            if (this.enquiryType == 1 || this.enquiryType == 2 || this.enquiryType == 3) {
                this.enquiry.CommunicationLogs = communicationlogs;
                this.enquiry.CommunicationLogs[0].Queries = this.enquiry.Queries;
            }
            this.enquiryService.Create(this.enquiry)
                .subscribe((response: EnquiryModel) => {
                    this.form = new FormGroup({
                        EnquiryId: new FormControl(0),
                        //  EnquiryType: new FormControl('', [Validators.required, Validators.maxLength(50)]),
                        // CallerName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
                        //  ContactNumber: new FormControl('', [Validators.required, Validators.maxLength(50)]),
                        //  AlternateContactNumber: new FormControl('', [Validators.required, Validators.maxLength(50)]),
                        Queries: new FormControl('', [Validators.required, Validators.maxLength(50)]),
                        Relationship: new FormControl('', [Validators.required, Validators.maxLength(50)]),
                        IsAdminRequest: new FormControl(false),
                        IsCallBack: new FormControl(false),
                        IsTravelRequest: new FormControl(false)
                    });
                    this.toastrService.success('Enquiry Saved successfully.', 'Success', this.toastrConfig);
                    this.externalInput.deleteAttributes();
                    this.externalInput.IsCallRecieved = true;
                    this.externalInput.ExternalInputId = this.callid;
                    this.callcenteronlypageservice.Update(this.externalInput, this.callid)
                        .subscribe(() => {
                            let num = UtilityService.UUID();
                            this.globalState.NotifyDataChanged('CallRecieved', num);
                        });

                    this.dataExchange.Publish('clearAutoCompleteInput', '');
                    this.createDemands();
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
        else {
            this.enquiryToUpdate.Queries = this.enquiry.Queries;
            if (this.enquiryType == 1 || this.enquiryType == 2 || this.enquiryType == 3) {
                let communicationlogToDeactivate = new CommunicationLogModel();
                communicationlogToDeactivate.deleteAttributes();
                communicationlogToDeactivate.InteractionDetailsId = this.communicationlogtoupdateId;
                communicationlogToDeactivate.ActiveFlag = 'InActive';
                if (this.enquiry.AffectedPersonId != 0) {
                    this.enquiryToUpdate.AffectedPersonId = this.enquiry.AffectedPersonId;
                    communicationlogs[0].AffectedPersonId = this.enquiry.AffectedPersonId;
                    delete communicationlogs[0].AffectedObjectId;
                }
                if (this.enquiry.AffectedObjectId != 0) {
                    this.enquiryToUpdate.AffectedObjectId = this.enquiry.AffectedObjectId;
                    communicationlogs[0].AffectedObjectId = this.enquiry.AffectedObjectId;
                    delete communicationlogs[0].AffectedPersonId;
                }
                delete this.enquiryToUpdate.CommunicationLogs;
                communicationlogs[0].Queries = this.enquiryToUpdate.Queries;
                communicationlogs[0].EnquiryId = this.enquiryToUpdate.EnquiryId;
                this.enquiryService.Update(this.enquiryToUpdate, this.enquiryToUpdate.EnquiryId)
                    .map(() => { })
                    .flatMap(() => this.communicationlogservice.Update(communicationlogToDeactivate, this.communicationlogtoupdateId))
                    .map(() => { })
                    .flatMap(() => this.communicationlogservice.Create(communicationlogs[0]))
                    .map(() => { })
                    .flatMap(() => this.demandService.UpdateBulkToDeactivateFromCallId(this.caller.CallerId))
                    .map(() => { })
                    .subscribe(() => {
                        this.form = new FormGroup({
                            EnquiryId: new FormControl(0),
                            Queries: new FormControl('', [Validators.required, Validators.maxLength(50)]),
                            Relationship: new FormControl('', [Validators.required, Validators.maxLength(50)]),
                            IsAdminRequest: new FormControl(false),
                            IsCallBack: new FormControl(false),
                            IsTravelRequest: new FormControl(false)
                        });
                        this.toastrService.success('Enquiry updated successfully.', 'Success', this.toastrConfig);
                         let num = UtilityService.UUID();
                        this.globalState.NotifyDataChanged('CallRecieved', num);
                        this.createDemands();

                    })
            }
            else {
                this.enquiryService.Update(this.enquiryToUpdate, this.enquiryToUpdate.EnquiryId)
                    .subscribe(() => {
                        this.form = new FormGroup({
                            EnquiryId: new FormControl(0),
                            Queries: new FormControl('', [Validators.required, Validators.maxLength(50)]),
                            Relationship: new FormControl('', [Validators.required, Validators.maxLength(50)]),
                            IsAdminRequest: new FormControl(false),
                            IsCallBack: new FormControl(false),
                            IsTravelRequest: new FormControl(false)
                        });
                        this.toastrService.success('Enquiry updated successfully.', 'Success', this.toastrConfig);
                        let num = UtilityService.UUID();
                        this.globalState.NotifyDataChanged('CallRecieved', num);
                    });
            }
        }

    }

    createDemands(): void {

        if (this.enquiry.IsCallBack) {
            this.SetDemands(true, false, false, false);
        }
        if (this.enquiry.IsAdminRequest) {
            this.SetDemands(false, false, true, false);
        }
        if (this.enquiry.IsTravelRequest) {
            this.SetDemands(false, true, false, false);
        }
        if (this.enquiryType === 3) {
            this.SetDemands(false, false, false, true);
        }
        if (this.demands.length !== 0)
            this.demandService.CreateBulk(this.demands)
                .subscribe(() => {
                    this.demands = [];
                    this.communicationLogs = [];
                    this.toastrService.success('Demands Saved successfully.', 'Success', this.toastrConfig);
                    let num = UtilityService.UUID();
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
    }

    ngOnInit(): any {
        this.form = new FormGroup({
            EnquiryId: new FormControl(0),
            Queries: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            Relationship: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            IsAdminRequest: new FormControl(false),
            IsCallBack: new FormControl(false),
            IsTravelRequest: new FormControl(false)
        });

        this.currentIncident = +UtilityService.GetFromSession('CurrentIncidentId');
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.credential = UtilityService.getCredentialDetails();
        if (this.enquiryType == 1 || this.enquiryType == 3) {
            this.getPassengersCrews(this.currentIncident);
        }
        else if (this.enquiryType == 2) {
            this.getCargo(this.currentIncident);
        }
        else {
            this.getExternalInput(this.enquiryType);
        }
        this.getDepartments();

        this.enquiry.EnquiryType = this.enquiryTypes.find((x) => x.value == this.enquiryType).caption;
        this.enquiry.ExternalInputId = this.callid;
    }

    onActionClick(eventArgs: any) {
        console.log(eventArgs);
    }
}