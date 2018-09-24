import {
    Component, ViewEncapsulation, OnInit,
    Input, OnDestroy, HostListener
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription, Observable, Subject } from 'rxjs/Rx';
import { DemandTrailModel } from '../demand/components/demand.trail.model';
import {
    ResponseModel, DataExchangeService, KeyValue,
    GlobalConstants, UtilityService, GlobalStateService,
    AuthModel, KeyValueService, KeyValueModel, EnquiryType
} from '../../../shared';
import { EnquiryModel, EnquiryService } from './components';
import { AffectedPeopleModel } from "../affected.people/components";
import { AffectedObjectModel } from '../affected.objects/components';
import {
    PassengerService, CoPassengerMappingModel, CoPassangerModelsGroupIdsModel
} from "../passenger/components";

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
import * as moment from 'moment/moment';
import {
    CallCenterOnlyPageService, ExternalInputModel,
    PDAEnquiryModel, CargoEnquiryModel,
    MediaAndOtherQueryModel, GroundVictimQueryModel
} from '../../callcenteronlypage/component';

import { IAutocompleteActions }
    from '../../../shared/components/autocomplete/IAutocompleteActions';
import * as _ from 'underscore';
import { PeopleOnBoardWidgetService } from '../../widgets';
import { GroundVictimModel, GroundVictimService, AffectedVictimToView } from '../ground.victim';

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
        CommunicationLogService,
        PassengerService,
        GroundVictimService,
        KeyValueService
    ]
})
export class EnquiryEntryComponent implements OnInit, OnDestroy {
    @Input('callid') callid: number;
    @Input('enquiryType') enquiryType: number;

    public form: FormGroup;
    public activeKeyValues: KeyValueModel[] = [];
    enquiryTypes: any[] = GlobalConstants.ExternalInputEnquiryType;

    pdaenquery: PDAEnquiryModel = new PDAEnquiryModel();
    cargoquery: CargoEnquiryModel = new CargoEnquiryModel();
    otherquery: MediaAndOtherQueryModel = new MediaAndOtherQueryModel();
    groundvictimquery: GroundVictimQueryModel = new GroundVictimQueryModel();

    enquiry: EnquiryModel = new EnquiryModel();
    enquiriesToUpdate: EnquiryModel[] = [];
    enquiryToUpdate: EnquiryModel = new EnquiryModel();
    caller: CallerModel = new CallerModel();

    passengers: KeyValue[] = [];
    awbs: KeyValue[] = [];
    crews: KeyValue[] = [];
    victims: KeyValue[] = [];

    affectedPeople: AffectedPeopleToView[];
    affectedObjects: AffectedObjectsToView[];
    groundVictims: AffectedVictimToView[] = [];

    communicationLogs: CommunicationLogModel[];
    communicationLog: CommunicationLogModel = new CommunicationLogModel();

    date: Date = new Date();
    demand: DemandModel;
    demands: DemandModel[] = new Array<DemandModel>();

    currentDepartmentId: number;
    currentDepartmentName: string = '';
    currentIncident: number;
    departments: DepartmentModel[];

    selctedEnquiredPerson: AffectedPeopleToView;
    selctedEnquiredObject: AffectedObjectsToView;
    selctedEnquiredVictim: AffectedVictimToView;

    credential: AuthModel;
    isCallrecieved: boolean = false;
    initialvalue: KeyValue = new KeyValue('', 0);

    actionLinks: IAutocompleteActions[] = [{
        ActionName: 'CommunicationLink',
        ActionDescription: 'Communication Log Link',
        ActionIcon: 'fa fa-comments-o fa-lg'
    }];
    pdaNameForTrail: string = "";
    AWBNumber: string = "";
    ticketNumber: string = "";
    communications: CommunicationLogModel[] = [];
    showCallcenterModal: boolean = false;
    hidePDAModal: boolean = true;
    hideCargoModal: boolean = true;
    hideVictimModal: boolean = true;
    initialgroupId: number = 0;

    protected _onRouteChange: Subscription;
    externalInput: ExternalInputModel = new ExternalInputModel();
    communicationlogstoupdateId: number[] = [];
    communicationlog: CommunicationLogModel = new CommunicationLogModel();
    public submitted: boolean = false;
    copassengerlistpnr: AffectedPeopleToView[] = [];
    copassengerlistPassenger: AffectedPeopleToView[] = [];
    copassengerlistPassengerForMappedPerson: AffectedPeopleToView[] = [];
    selectedcountpnr: number;
    isPaxWithSamePNRSelected: boolean = false;
    isCoPaxSelected: boolean = false;
    totallistselected: boolean = false;
    totalcount: number;
    consolidatedCopassengers: AffectedPeopleToView[] = [];
    copassengersBygroup: CoPassengerMappingModel[] = [];
    showCoPassangerPannel: boolean = false;
    selectedCoPassangers: AffectedPeopleToView[] = [];
    initialgrouidlist: number[] = [];
    pdaenquiryid: number;
    affectedId: number;
    createdBy: number;
    createdByName: string;
    DemandCheckDisabled: string = "";
    public isArchive: boolean = false;
    public EnquiryType: typeof EnquiryType = EnquiryType;

    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     *Creates an instance of EnquiryEntryComponent.
     * @param {AffectedPeopleService} affectedPeopleService
     * @param {AffectedObjectsService} affectedObjectsService
     * @param {DepartmentService} departmentService
     * @param {EnquiryService} enquiryService
     * @param {InvolvePartyService} involvedPartyService
     * @param {DemandService} demandService
     * @param {DataExchangeService<string>} dataExchange
     * @param {GlobalStateService} globalState
     * @param {ToastrService} toastrService
     * @param {ToastrConfig} toastrConfig
     * @param {Router} _router
     * @param {CallCenterOnlyPageService} callcenteronlypageservice
     * @param {CommunicationLogService} communicationlogservice
     * @param {PassengerService} passangerService
     * @param {KeyValueService} keyValueService
     * @memberof EnquiryEntryComponent
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
        private _router: Router,
        private callcenteronlypageservice: CallCenterOnlyPageService,
        private communicationlogservice: CommunicationLogService,
        private passangerService: PassengerService,
        private groundVictimService: GroundVictimService,
        private keyValueService: KeyValueService) { }

    private getPassengersAndCrews(currentIncident: number): void {
        this.involvedPartyService.GetFilterByIncidentId(currentIncident)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedPeople = this.affectedPeopleService.FlattenAffectedPeople(response.Records[0]);
                const passengerModels = this.affectedPeople.filter(x => x.IsCrew === false);

                passengerModels.sort(function (a, b) {
                    return (a.PassengerName.toUpperCase() > b.PassengerName.toUpperCase()) ?
                        1 : ((b.PassengerName.toUpperCase() > a.PassengerName.toUpperCase()) ? -1 : 0);
                });
                const crewModels = this.affectedPeople.filter(x => x.IsCrew == true);

                crewModels.sort(function (a, b) {
                    return (a.CrewName.toUpperCase() > b.CrewName.toUpperCase()) ?
                        1 : ((b.CrewName.toUpperCase() > a.CrewName.toUpperCase()) ? -1 : 0);
                });

                for (const affectedPerson of passengerModels) {
                    // this.passengers.push(new KeyValue(affectedPerson.PassengerName + ' (' + affectedPerson.TicketNumber + ')', affectedPerson.AffectedPersonId));
                    this.passengers.push(new KeyValue(`${affectedPerson.PassengerName} (${affectedPerson.TicketNumber})`, affectedPerson.AffectedPersonId));
                    this.copassengerlistPassenger.push(Object.assign({}, affectedPerson));
                }

                this.copassengerlistPassenger.forEach(x => x.IsSelected = false);
                for (const affectedPerson of crewModels) {
                    // this.crews.push(new KeyValue(affectedPerson.CrewName + ' (' + affectedPerson.TicketNumber + ')', affectedPerson.AffectedPersonId));
                    this.crews.push(new KeyValue(`${affectedPerson.CrewName} (${affectedPerson.TicketNumber})`, affectedPerson.AffectedPersonId));
                }

            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            }, () => {
                this.getExternalInput(this.enquiryType);
            });
    }

    private getCargo(currentIncident: number): void {
        this.affectedObjectsService.GetFilterByIncidentId(currentIncident)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                this.affectedObjects = this.affectedObjectsService.FlattenAffactedObjects(response.Records[0]);

                for (const affectedObject of this.affectedObjects) {
                    // this.awbs.push(new KeyValue(affectedObject.AWB + ' (' + affectedObject.TicketNumber + ')', affectedObject.AffectedObjectId));
                    this.awbs.push(new KeyValue(`${affectedObject.AWB}  (${affectedObject.TicketNumber})`, affectedObject.AffectedObjectId));
                }
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            }, () => {
                this.getExternalInput(this.enquiryType);
            });
    }

    private getGroundVictims(currentIncident: number): void {
        this.groundVictimService.GetAllGroundVictimsByIncident(currentIncident)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((victim: GroundVictimModel) => {
                let viewModel: AffectedVictimToView = new AffectedVictimToView();
                viewModel.AffectedId = victim.InvolvedParty.Affecteds[0].AffectedId;
                viewModel.InvolvedPartyId = victim.InvolvedPartyId;
                viewModel.GroundVictimId = victim.GroundVictimId;
                viewModel.GroundVictimName = victim.GroundVictimName;
                viewModel.GroundVictimType = victim.GroundVictimType;
                viewModel.AffectedCount = victim.AffectedCount;
                viewModel.NOKName = victim.NOKName;
                viewModel.NOKContactNumber = victim.NOKContactNumber;

                this.groundVictims.push(viewModel);
                this.victims.push(new KeyValue(victim.GroundVictimName, victim.GroundVictimId));
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            }, () => {
                this.getExternalInput(this.enquiryType);
            });
    }

    private getDepartments(): void {
        this.departmentService.GetAll()
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<DepartmentModel>) => {
                this.departments = response.Records;
                if (response)
                    this.currentDepartmentName = this.departments
                        .find(x => x.DepartmentId == this.currentDepartmentId).DepartmentName;
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    private getExternalInput(enquirytype): void {
        let queryDetailService: Observable<ExternalInputModel[]>

        if (enquirytype == +EnquiryType.Passenger || enquirytype == +EnquiryType.Crew) {
            queryDetailService = this.callcenteronlypageservice
                .GetPassengerAndCrewQueryByIncident(this.currentIncident, this.callid)
                .map(x => x.Records);
        }

        else if (enquirytype == +EnquiryType.Cargo) {
            queryDetailService = this.callcenteronlypageservice
                .GetCargoQueryByIncident(this.currentIncident, this.callid)
                .map(x => x.Records);
        }

        else if (enquirytype == +EnquiryType.GroundVictim) {
            queryDetailService = this.callcenteronlypageservice
                .GetGroundVictimQueryByIncident(this.currentIncident, this.callid)
                .map(x => x.Records);
        }

        else if (enquirytype >= +EnquiryType.Media && enquirytype <= +EnquiryType.CustomerDissatisfaction) {
            queryDetailService = this.callcenteronlypageservice
                .GetMediaAndOtherQueryByIncident(this.currentIncident, this.callid)
                .map(x => x.Records);
        }

        queryDetailService
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ExternalInputModel[]) => {

                if (response[0].PDAEnquiry != null) {
                    this.pdaenquery = response[0].PDAEnquiry;
                    this.form.controls["Queries"].reset({ value: this.pdaenquery.Query, disabled: false });
                }

                else if (response[0].CargoEnquiry != null) {
                    this.cargoquery = response[0].CargoEnquiry;
                    this.form.controls["Queries"].reset({ value: this.cargoquery.Query, disabled: false });
                }

                else if (response[0].MediaAndOtherQuery != null) {
                    this.otherquery = response[0].MediaAndOtherQuery;
                    this.form.controls["Queries"].reset({ value: this.otherquery.Query, disabled: false });
                }

                else if (response[0].GroundVictimEnquiry != null) {
                    this.groundvictimquery = response[0].GroundVictimEnquiry;
                    this.form.controls["Queries"].reset({ value: this.groundvictimquery.Query, disabled: false });
                }

                this.enquiry.CallerId = response[0].Caller.CallerId;
                this.enquiry.ExternalInputId = this.callid;
                this.caller = response[0].Caller;
                this.isCallrecieved = response[0].IsCallRecieved;

                if (enquirytype == +EnquiryType.Passenger) {
                    this.pdaenquiryid = this.pdaenquery.PDAEnquiryId;
                }

                this.DemandCheckDisabled = "";

                if (this.isCallrecieved) {
                    this.DemandCheckDisabled = "disabled";

                    this.enquiryToUpdate = this.enquiryType != +EnquiryType.Passenger ? response[0].Enquiries[0] :
                        response[0].Enquiries.find(x => x.AffectedPersonId == this.pdaenquery.AffectedPersonId);

                    this.enquiry = this.enquiryToUpdate;
                    this.form.controls["Queries"].reset(this.enquiryToUpdate.Queries); // , { disabled: false }

                    if (this.enquiryType == +EnquiryType.Passenger
                        || this.enquiryType == +EnquiryType.Cargo
                        || this.enquiryType == +EnquiryType.Crew
                        || this.enquiryType == +EnquiryType.GroundVictim) {

                        this.form.controls["IsCallBack"].reset(this.enquiryToUpdate.IsCallBack);
                        this.form.controls["IsAdminRequest"].reset(this.enquiryToUpdate.IsAdminRequest);
                        this.form.controls["IsTravelRequest"].reset(this.enquiryToUpdate.IsTravelRequest);

                        this.initialvalue = (this.enquiryType == +EnquiryType.Passenger) ?
                            this.passengers.find(x => x.Value == this.enquiryToUpdate.AffectedPersonId) :
                            (this.enquiryType == +EnquiryType.Crew ? this.crews.find(x => x.Value == this.enquiry.AffectedPersonId) :
                                (this.enquiryType == +EnquiryType.Cargo ? this.awbs.find(x => x.Value == this.enquiry.AffectedObjectId) :
                                    (this.enquiryType == +EnquiryType.GroundVictim ? this.victims.find(x => x.Value == this.enquiry.GroundVictimId) :
                                        new KeyValue("", 0))));
                    }

                    if (this.enquiryType == +EnquiryType.Passenger && this.initialvalue.Value != 0) {
                        this.enquiriesToUpdate = response[0].Enquiries;
                        this.showCoPassangerPannel = true;

                        let obj = this.affectedPeople.find(x => x.AffectedPersonId == this.initialvalue.Value);
                        this.affectedId = obj.AffectedId;
                        this.CoPassangerListPopulation(obj);

                        if (obj.GroupId > 0) {
                            this.SelectPeopleWithSameGroupId(obj.GroupId, true, true);
                            this.initialgroupId = obj.GroupId;
                        }
                        this.PopulateConsolidatedCoPassangers();
                        this.consolidatedCopassengers.map(x => this.initialgrouidlist.push(x.PassengerId))

                        this.consolidatedCopassengers.forEach(x => {
                            x.IsSelected = false;
                            response[0].Enquiries.forEach(y => {
                                if (x.AffectedPersonId == y.AffectedPersonId) {
                                    x.IsSelected = true;
                                }
                            });
                        });
                    }

                    if (this.enquiriesToUpdate.length > 0) {
                        this.communicationlogstoupdateId = _.pluck(_.flatten(_.pluck
                            (this.enquiriesToUpdate, 'CommunicationLogs')), 'InteractionDetailsId');
                    }
                    else if (this.enquiry.CommunicationLogs !== undefined)
                        this.communicationlogstoupdateId
                            .push(this.enquiry.CommunicationLogs[0].InteractionDetailsId);
                }
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    //co-passenger selection
    private SelectPeopleWithSameGroupId(groupid: number, isselected: boolean, ismappedersonchanged: boolean): void {
        this.copassengerlistPassengerForMappedPerson
            .forEach(x => {
                if (x.GroupId == groupid) {
                    x.IsSelected = isselected;
                }
            });
    }

    private CoPassangerListPopulation(obj): void {
        this.copassengerlistpnr = [];

        this.affectedPeople.filter(x => x.Pnr == obj.Pnr)
            .map(y => this.copassengerlistpnr.push(Object.assign({}, y)));

        this.copassengerlistpnr = _.without(this.copassengerlistpnr,
            _.findWhere(this.copassengerlistpnr, { AffectedPersonId: obj.AffectedPersonId }));

        this.copassengerlistPassenger
            .map(x => this.copassengerlistPassengerForMappedPerson.push(Object.assign({}, x)));

        this.copassengerlistPassengerForMappedPerson.forEach(x => {
            this.copassengerlistpnr.forEach(y => {
                if (x.AffectedPersonId == y.AffectedPersonId) {
                    x.IsSelected = true;
                    x.PNRdisabled = "disabled";
                }
            });
            x.PassengerName = `${x.PassengerName}  (${x.Pnr})`;
        });

        this.copassengerlistPassengerForMappedPerson = _.without(this.copassengerlistPassengerForMappedPerson,
            _.findWhere(this.copassengerlistPassengerForMappedPerson, { AffectedPersonId: obj.AffectedPersonId }));

        this.copassengerlistPassengerForMappedPerson = this.copassengerlistPassengerForMappedPerson
            .sort(function (a, b) {
                return (a.PassengerName.toUpperCase() > b.PassengerName.toUpperCase()) ?
                    1 : ((b.PassengerName.toUpperCase() > a.PassengerName.toUpperCase()) ? -1 : 0);
            });
    }

    private PopulateConsolidatedCoPassangers(): void {
        this.consolidatedCopassengers = [];
        this.copassengerlistPassengerForMappedPerson
            .filter(x => x.IsSelected == true)
            .map(x => {
                let obj = Object.assign({}, x);
                this.consolidatedCopassengers.push(obj);
            });
    }

    public onNotifyPassenger(message: KeyValue): void {
        this.enquiry.AffectedPersonId = message.Value;
        this.enquiry.AffectedObjectId = 0;
        this.enquiry.GroundVictimId = 0;

        this.communicationLog.AffectedPersonId = message.Value;
        delete this.communicationLog.AffectedObjectId;
        delete this.communicationLog.GroundVictimId;
        delete this.enquiry.AffectedObjectId;
        delete this.enquiry.GroundVictimId

        let obj = this.affectedPeople
            .find(x => x.AffectedPersonId == message.Value);

        this.affectedId = obj.AffectedId;
        this.copassengerlistPassengerForMappedPerson.length = 0;
        this.CoPassangerListPopulation(obj);
        this.showCoPassangerPannel = true;

        if (obj.GroupId > 0) {
            this.SelectPeopleWithSameGroupId(obj.GroupId, true, true);
        }
        this.PopulateConsolidatedCoPassangers();
        this.resetallcopassangers();
    }

    public onNotifyCrew(message: KeyValue): void {
        this.enquiry.AffectedPersonId = message.Value;
        this.enquiry.AffectedObjectId = 0;
        this.enquiry.GroundVictimId = 0;

        this.affectedId = this.affectedPeople
            .find(x => x.AffectedPersonId == message.Value).AffectedId;

        this.communicationLog.AffectedPersonId = message.Value;
        delete this.communicationLog.AffectedObjectId;
        delete this.communicationLog.GroundVictimId;
        delete this.enquiry.AffectedObjectId;
        delete this.enquiry.GroundVictimId
    }

    public onNotifyCargo(message: KeyValue): void {
        this.enquiry.AffectedObjectId = message.Value;
        this.enquiry.AffectedPersonId = 0;
        this.enquiry.GroundVictimId = 0;

        this.affectedId = this.affectedObjects
            .find(x => x.AffectedObjectId == message.Value).AffectedId;

        this.communicationLog.AffectedObjectId = message.Value;
        delete this.communicationLog.GroundVictimId;
        delete this.communicationLog.AffectedPersonId;
        delete this.enquiry.AffectedPersonId;
        delete this.enquiry.GroundVictimId
    }

    public onNotifyGroundVictim(message: KeyValue): void {
        this.enquiry.GroundVictimId = message.Value;
        this.enquiry.AffectedObjectId = 0;
        this.enquiry.AffectedPersonId = 0;

        this.affectedId = this.groundVictims
            .find(x => x.GroundVictimId == message.Value).AffectedId;

        this.communicationLog.GroundVictimId = message.Value;
        delete this.communicationLog.AffectedPersonId;
        delete this.communicationLog.AffectedObjectId;
        delete this.enquiry.AffectedPersonId;
        delete this.enquiry.AffectedObjectId
    }

    public resetallcopassangers(): void {
        this.selectedCoPassangers = [];
        this.demands = [];
        this.selectedcountpnr = 0;
        this.totalcount = 0;
    }

    public onResetPassenger(): void {
        this.copassengerlistpnr = [];
        this.copassengerlistPassengerForMappedPerson = [];
        this.consolidatedCopassengers = [];
    }

    public onResetCrew(): void {
    }

    public onResetCargo(): void {
    }

    public onResetGroundVictim(): void {
    }

    @HostListener('document:click', ['$event'])
    onDocunentClick(event) {
        jQuery('ul.dropdown-menu-down').hide();
        this.isPaxWithSamePNRSelected = false;
        this.isCoPaxSelected = false;
    }

    //set models to save or update
    private SetCommunicationLog(requestertype, interactionType, affectedPersonId?: number): CommunicationLogModel[] {
        let communicationLogs = new Array<CommunicationLogModel>();
        let comm: CommunicationLogModel = new CommunicationLogModel();
        comm.InteractionDetailsId = 0;
        comm.InteractionDetailsType = interactionType;
        comm.Answers = `${this.form.controls['Queries'].value} Caller: ${this.caller.FirstName}  ${this.caller.LastName} Contact Number: ${this.caller.ContactNumber}`;
        comm.RequesterName = this.credential.UserName;
        comm.RequesterDepartment = this.currentDepartmentName;
        comm.RequesterType = requestertype;
        comm.CreatedBy = +this.credential.UserId;

        comm.AffectedPersonId = (this.enquiryType == +EnquiryType.Passenger || this.enquiryType == +EnquiryType.Crew) ?
            this.enquiry.AffectedPersonId : null;

        if (affectedPersonId > 0) {
            comm.AffectedPersonId = affectedPersonId;
        }

        comm.AffectedObjectId = (this.enquiryType == +EnquiryType.Cargo) ?
            this.enquiry.AffectedObjectId : null;

        comm.GroundVictimId = (this.enquiryType == +EnquiryType.GroundVictim) ?
            this.enquiry.GroundVictimId : null;

        comm.Queries = this.enquiry.Queries;
        communicationLogs.push(comm);
        return communicationLogs;
    }

    private CreateDemandTrails(demand: DemandModel): DemandTrailModel[] {
        let demandTrails: DemandTrailModel[] = [];
        let demandTrail: DemandTrailModel = new DemandTrailModel();
        let editedFields = '';
        let answer = '';

        demandTrail.Answers = "";
        demandTrail.IncidentId = demand.IncidentId;
        demandTrail.DemandTypeId = demand.DemandTypeId;
        demandTrail.DemandCode = demand.DemandCode;
        demandTrail.ScheduleTime = demand.ScheduleTime;
        demandTrail.ContactNumber = demand.ContactNumber;
        demandTrail.Priority = demand.Priority;
        demandTrail.RequiredLocation = demand.RequiredLocation;
        demandTrail.RequesterName = demand.RequestedBy;

        demandTrail.RequesterDepartmentName = this.departments
            .some(x => x.DepartmentId == demand.RequesterDepartmentId) ?
            this.departments.find(x => x.DepartmentId == demand.RequesterDepartmentId).DepartmentName : null;

        demandTrail.RequesterParentDepartmentName = this.departments
            .some(x => x.DepartmentId == demand.RequesterParentDepartmentId) ?
            this.departments.find(x => x.DepartmentId == demand.RequesterParentDepartmentId).DepartmentName : null;

        demandTrail.TargetDepartmentName = this.departments
            .find(x => x.DepartmentId == demand.TargetDepartmentId).DepartmentName;

        demandTrail.ApproverDepartmentName = this.departments
            .some(x => x.DepartmentId == demand.ApproverDepartmentId) ?
            this.departments.find(x => x.DepartmentId == demand.ApproverDepartmentId).DepartmentName : null;

        demandTrail.RequesterType = demand.RequesterType;
        demandTrail.DemandDesc = demand.DemandDesc;
        demandTrail.IsApproved = demand.IsApproved;
        demandTrail.ApprovedDt = demand.ApprovedDt;
        demandTrail.IsCompleted = false;
        demandTrail.ScheduledClose = null;
        demandTrail.IsClosed = false;
        demandTrail.ClosedOn = null;
        demandTrail.IsRejected = false;
        demandTrail.RejectedDate = null;
        demandTrail.DemandStatusDescription = demand.DemandStatusDescription;
        demandTrail.Remarks = demand.Remarks;
        demandTrail.ActiveFlag = "Active";
        demandTrail.CreatedBy = demand.CreatedBy ? demand.CreatedBy : this.createdBy;
        demandTrail.CreatedOn = demand.CreatedOn ? demand.CreatedOn : new Date();

        let date = new Date();
        answer = `<div><p> ${demand.DemandStatusDescription} <strong>Date :</strong>  ${moment(date).format('DD-MMM-YYYY HH:mm')}   </p><div>`;
        answer = answer + '</p><div>';
        demandTrail.Answers = answer;
        demandTrails.push(demandTrail);
        return demandTrails;
    }

    private SetDemandEntity(isCallback, isTravelRequest, isAdmin, isCrew, affectedId, affectedPersonId?: number): void {
        if (isCallback || isCrew || isTravelRequest || isAdmin) {
            let demand: DemandModel = new DemandModel();

            const type = isCallback ? 'Call Back' : (isTravelRequest ? 'Travel' : (isAdmin ? 'Admin' : 'Crew'));
            const typeSuffix = isCallback ? 'C' : (isTravelRequest ? 'T' : (isAdmin ? 'A' : 'Crw'));

            const scheduleTime = isCallback ? GlobalConstants.ScheduleTimeForCallback :
                (isTravelRequest ? GlobalConstants.ScheduleTimeForTravel :
                    (isAdmin ? GlobalConstants.ScheduleTimeForAdmin : GlobalConstants.ScheduleTimeForDemandForCrew));

            if (this.enquiryType == +EnquiryType.Passenger || this.enquiryType == +EnquiryType.Crew) {
                demand.AffectedPersonId = this.enquiry.AffectedPersonId;
            }
            else if (this.enquiryType == +EnquiryType.Cargo) {
                demand.AffectedObjectId = this.enquiry.AffectedObjectId;
            }
            else if (this.enquiryType == +EnquiryType.GroundVictim) {
                demand.GroundVictimId = this.enquiry.GroundVictimId;
            }

            this.selctedEnquiredPerson = (demand.AffectedPersonId && demand.AffectedPersonId !== 0) ?
                this.affectedPeople.find((x) => x.AffectedPersonId === demand.AffectedPersonId) : null;

            this.selctedEnquiredObject = (demand.AffectedObjectId && demand.AffectedObjectId !== 0) ?
                this.affectedObjects.find((x) => x.AffectedObjectId === demand.AffectedObjectId) : null;

            this.selctedEnquiredVictim = (demand.GroundVictimId && demand.GroundVictimId !== 0) ?
                this.groundVictims.find((x) => x.GroundVictimId === demand.GroundVictimId) : null;

            const personName: string = (this.selctedEnquiredPerson !== null && this.enquiryType == +EnquiryType.Passenger) ?
                this.selctedEnquiredPerson.PassengerName :
                ((this.selctedEnquiredPerson !== null && this.enquiryType == +EnquiryType.Crew) ? this.selctedEnquiredPerson.CrewName :
                    ((this.selctedEnquiredVictim !== null && this.enquiryType == +EnquiryType.GroundVictim) ? this.selctedEnquiredVictim.GroundVictimName : ''));

            demand.IncidentId = +UtilityService.GetFromSession('CurrentIncidentId');

            demand.AffectedId = (this.enquiryType == +EnquiryType.Passenger || this.enquiryType == +EnquiryType.Crew) ?
                this.affectedPeople.find((x) => x.AffectedPersonId === demand.AffectedPersonId).AffectedId :
                ((this.enquiryType == +EnquiryType.Cargo) ? this.affectedObjects.find((x) => x.AffectedObjectId === demand.AffectedObjectId).AffectedId :
                    ((this.enquiryType == +EnquiryType.GroundVictim) ? this.groundVictims.find((x) => x.GroundVictimId === demand.GroundVictimId).AffectedId : 0));

            if (demand.AffectedId == 0) {
                delete demand.AffectedId;
            }

            demand.AWB = (this.enquiryType == +EnquiryType.Cargo) ?
                this.affectedObjects.find((x) => x.AffectedObjectId === demand.AffectedObjectId).AWB : null;

            demand.ContactNumber = this.caller.ContactNumber;

            demand.TargetDepartmentId = isCallback ? this.currentDepartmentId
                : (isTravelRequest ? +this.activeKeyValues.find((x: KeyValueModel) => x.Key === 'TargetDepartmentTravel').Value
                    : (isAdmin ? +this.activeKeyValues.find((x: KeyValueModel) => x.Key === 'TargetDepartmentAdmin').Value
                        : +this.activeKeyValues.find((x: KeyValueModel) => x.Key === 'TargetDepartmentCrew').Value));

            demand.RequesterDepartmentId = this.currentDepartmentId;
            demand.RequesterParentDepartmentId = this.departments
                .find((x) => x.DepartmentId === this.currentDepartmentId).ParentDepartmentId;

            const now = new Date();
            demand.DemandCode = 'DEM' + typeSuffix + '-' + this.addzero(now.getSeconds()) + this.addzero(now.getMinutes()) + this.addzero(now.getHours()) +
                this.addzero(now.getDate()) + this.addzero(now.getMonth() + 1) + now.getFullYear().toString(); //'DEM-' + UtilityService.UUID(); 

            if (this.enquiryType == +EnquiryType.Passenger || this.enquiryType == +EnquiryType.Crew) {
                demand.DemandDesc = `${type} Requested for ${personName} (${this.selctedEnquiredPerson.TicketNumber}) and the caller name is: ${this.caller.FirstName} ${this.caller.LastName} and the discussion note is :${this.enquiry.Queries}`;
            }
            else if (this.enquiryType == +EnquiryType.Cargo) {
                demand.DemandDesc = `${type} Requested for ${this.selctedEnquiredObject.AWB} (${this.selctedEnquiredObject.TicketNumber}) and the caller name is: ${this.caller.FirstName} ${this.caller.LastName} and the discussion note is :${this.enquiry.Queries}`;
            }
            else if (this.enquiryType == +EnquiryType.GroundVictim) {
                demand.DemandDesc = `${type} Requested for ${personName} and the caller name is: ${this.caller.FirstName} ${this.caller.LastName} and the discussion note is :${this.enquiry.Queries}`;
            }
            else {
                demand.DemandDesc = `${type} Requested for enquery and the caller name is: ${this.caller.FirstName} ${this.caller.LastName} and the discussion note is :${this.enquiry.Queries}`;
            }

            demand.DemandStatusDescription = `New demand by ${this.createdByName} (${this.currentDepartmentName})`;
            demand.DemandTypeId = GlobalConstants.DemandTypeId;
            demand.CallerId = this.caller.CallerId;
            demand.IncidentId = this.currentIncident;
            demand.IsApproved = true;
            demand.IsClosed = false;
            demand.IsCompleted = false;
            demand.IsRejected = false;

            demand.PDATicketNumber = (this.selctedEnquiredPerson !== null) ? this.selctedEnquiredPerson.TicketNumber
                : (this.selctedEnquiredObject != null ? this.selctedEnquiredObject.TicketNumber : null);

            demand.Priority = GlobalConstants.Priority.find((x) => x.value === '1').caption;
            demand.RequestedBy = this.credential.UserName;
            demand.CreatedBy = +this.credential.UserId;
            demand.RequiredLocation = GlobalConstants.RequiredLocation;
            demand.ScheduleTime = scheduleTime.toString();
            demand.RequesterType = "Others";
            demand.DemandTrails = this.CreateDemandTrails(demand);

            demand.CommunicationLogs = this.SetCommunicationLog(type + " Demand", GlobalConstants.InteractionDetailsTypeDemand, demand.AffectedPersonId);
            demand.CommunicationLogs[0].Queries = `${demand.CommunicationLogs[0].Queries} Demand Code: ${demand.DemandCode}`;
            demand.CommunicationLogs[0].Answers = `${demand.CommunicationLogs[0].Answers} Demand Code: ${demand.DemandCode}`;

            this.demands.push(demand);
        }
    }

    private SetEnquiryforCoPassangers(enquiryModel: EnquiryModel): EnquiryModel[] {
        let enquirymodels: EnquiryModel[] = [];

        this.selectedCoPassangers.map(x => {
            let enquiry: EnquiryModel = new EnquiryModel();
            enquiry.AffectedPersonId = x.AffectedPersonId;
            enquiry.IncidentId = this.currentIncident;
            enquiry.Remarks = '';
            enquiry.CallerId = enquiryModel.CallerId;
            enquiry.Queries = enquiryModel.Queries;
            enquiry.CreatedBy = +this.credential.UserId;
            enquiry.EnquiryType = this.enquiry.EnquiryType;
            enquiry.ExternalInputId = this.enquiry.ExternalInputId;
            enquiry.IsAdminRequest = this.enquiry.IsAdminRequest;
            enquiry.IsCallBack = this.enquiry.IsCallBack;
            enquiry.IsTravelRequest = this.enquiry.IsTravelRequest;

            if (x.IsSelected == true) {
                enquiry.IsAdminRequest = enquiryModel.IsAdminRequest;
                enquiry.IsCallBack = enquiryModel.IsCallBack;
                enquiry.IsTravelRequest = enquiryModel.IsTravelRequest;
            }
            enquiry.CommunicationLogs = this.SetCommunicationLog
                (GlobalConstants.RequesterTypeEnquiry, GlobalConstants.InteractionDetailsTypeEnquiry, x.AffectedPersonId);

            enquirymodels.push(enquiry);
        });
        return enquirymodels;
    }

    private GetCoPassangersByAffectedPersonId(affectedpersonId): Observable<CoPassengerMappingModel[]> {
        let copassangerModels: CoPassengerMappingModel[] = [];

        this.consolidatedCopassengers.map(x => {
            let copssanger: CoPassengerMappingModel = new CoPassengerMappingModel();
            copssanger.PassengerId = x.PassengerId;
            copssanger.GroupId = x.GroupId;
            copssanger.CreatedBy = +UtilityService.GetFromSession('CurrentUserId');
            copssanger.CreatedOn = new Date();
            copssanger.ActiveFlag = 'Active';
            copassangerModels.push(copssanger);
        });

        let copssanger: CoPassengerMappingModel = new CoPassengerMappingModel();
        let obj = this.affectedPeople.find(x => x.AffectedPersonId == affectedpersonId);

        copssanger.PassengerId = obj.PassengerId;
        copssanger.GroupId = obj.GroupId;
        copssanger.CreatedBy = +UtilityService.GetFromSession('CurrentUserId');
        copssanger.CreatedOn = new Date();
        copssanger.ActiveFlag = 'Active';
        copassangerModels.push(copssanger);
        let groupids: number[] = [];
        copassangerModels.map(x => groupids.push(x.GroupId));
        groupids = _.unique(groupids);

        let copassangergroup: CoPassangerModelsGroupIdsModel = new CoPassangerModelsGroupIdsModel();
        copassangergroup.copassangers = copassangerModels;
        copassangergroup.groupIds = groupids;
        return this.passangerService.deleteoldgroupsandaddcopassanger(copassangergroup)
    }

    private CreateDemandsOnEnquery(affectedId: number, affectedPersonIds?: number[]): void {
        if (this.enquiry.IsCallBack) {
            this.callSetDemands(true, false, false, false, affectedId, affectedPersonIds);
        }

        if (this.enquiry.IsAdminRequest) {
            this.callSetDemands(false, false, true, false, affectedId, affectedPersonIds);
        }

        if (this.enquiry.IsTravelRequest) {
            this.callSetDemands(false, true, false, false, affectedId, affectedPersonIds);
        }

        if (this.demands.length !== 0)
            this.demandService.CreateBulk(this.demands)
                .subscribe(() => {
                    this.demands = [];
                    this.communicationLogs = [];
                    this.toastrService.success('Demands Saved successfully.', 'Success', this.toastrConfig);
                    let num = UtilityService.UUID();
                }, (error: any) => {
                    if (error == "TypeError: error.json is not a function" || error == "TypeError: error.Server error") {
                        this.demands = [];
                        this.communicationLogs = [];
                        this.toastrService.success('Demands Saved successfully.', 'Success', this.toastrConfig);
                        let num = UtilityService.UUID();
                    }
                    console.log(`Error: ${error.message}`);
                });
    }

    private callSetDemands(isCallback, isTravelRequest, isAdmin, isCrew, affectedId, affectedPersonIds?: number[]) {
        if (affectedPersonIds != undefined && affectedPersonIds.length > 0) {
            affectedPersonIds.map(x => this.SetDemandEntity(isCallback, isTravelRequest, isAdmin, isCrew, x));
        } else {
            this.SetDemandEntity(isCallback, isTravelRequest, isAdmin, isCrew, affectedId);
        }
    }

    private getAllActiveKeyValues(): void {
        this.keyValueService.GetAll()
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<KeyValueModel>) => {
                this.activeKeyValues = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    public ngOnInit(): any {
        this.getAllActiveKeyValues();

        if (this._router.url.indexOf('archivedashboard') > -1) {
            this.isArchive = true;
            this.currentIncident = +UtilityService.GetFromSession('ArchieveIncidentId');
        }
        else {
            this.isArchive = false;
            this.currentIncident = +UtilityService.GetFromSession('CurrentIncidentId');
        }

        this.form = this.formInitialization();
        this.currentIncident = +UtilityService.GetFromSession('CurrentIncidentId');
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.credential = UtilityService.getCredentialDetails();

        if (this.enquiryType == +EnquiryType.Passenger || this.enquiryType == +EnquiryType.Crew) {
            this.getPassengersAndCrews(this.currentIncident);
        }
        else if (this.enquiryType == +EnquiryType.Cargo) {
            this.getCargo(this.currentIncident);
        }
        else if (this.enquiryType == +EnquiryType.GroundVictim) {
            this.getGroundVictims(this.currentIncident);
        }
        else {
            this.getExternalInput(this.enquiryType);
        }
        this.getDepartments();

        this.enquiry.EnquiryType = this.enquiryTypes
            .find((x) => x.value == this.enquiryType).caption;

        this.enquiry.ExternalInputId = this.callid;
        this.createdBy = +this.credential.UserId;
        this.createdByName = this.credential.UserName;
    }

    public ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public onPDAActionClick(eventArgs: any) {
        let affectedPersonid = eventArgs.selectedItem.Value;

        this.affectedPeopleService.GetCommunicationByPDA(affectedPersonid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<AffectedPeopleModel>) => {
                let responseModel: AffectedPeopleModel = response.Records[0];

                this.pdaNameForTrail = responseModel.Passenger != null ?
                    responseModel.Passenger.PassengerName.toUpperCase() : '';

                this.pdaNameForTrail = this.pdaNameForTrail ?
                    this.pdaNameForTrail : responseModel.Crew != null ? responseModel.Crew.CrewName.toUpperCase() : '';

                this.ticketNumber = responseModel.TicketNumber;
                this.communications = responseModel.CommunicationLogs;
                this.showCallcenterModal = true;
                this.hidePDAModal = false;

            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    public onCargoActionClick(eventArgs: any) {
        let affectedCargoid = eventArgs.selectedItem.Value;

        this.affectedObjectsService.GetCommunicationByAWB(affectedCargoid)
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<AffectedObjectModel>) => {
                let responseModel: AffectedObjectModel = response.Records[0];
                this.AWBNumber = responseModel.AWB;
                this.ticketNumber = responseModel.TicketNumber;
                this.communications = responseModel.CommunicationLogs;
                this.showCallcenterModal = true;
                this.hideCargoModal = false;

            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    private formInitialization(): FormGroup {
        return new FormGroup({
            EnquiryId: new FormControl(0),
            Queries: new FormControl('', [Validators.required, Validators.maxLength(1000)]),
            IsAdminRequest: new FormControl(false),
            IsCallBack: new FormControl(false),
            IsTravelRequest: new FormControl(false)
        });
    }

    public cancelModal() {
        this.hidePDAModal = true;
        this.hideCargoModal = true;
        this.showCallcenterModal = false;
    }

    private nullorwhitecheck(id: number): boolean {
        if ((id == null) || (id == undefined) || (id == 0)) {
            return false
        }
        else {
            return true;
        }
    }

    public SaveEnquiryDemandCaller(): void {
        this.submitted = true;

        if (this.form.valid && (
            ((this.enquiryType == +EnquiryType.Passenger || this.enquiryType == +EnquiryType.Crew) && this.nullorwhitecheck(this.enquiry.AffectedPersonId)) ||
            (this.enquiryType == +EnquiryType.Cargo && this.nullorwhitecheck(this.enquiry.AffectedObjectId) ||
                (this.enquiryType == +EnquiryType.GroundVictim && this.nullorwhitecheck(this.enquiry.GroundVictimId)) ||
                (this.enquiryType >= +EnquiryType.Media && this.enquiryType <= +EnquiryType.CustomerDissatisfaction)
            ))) {

            if (this.enquiryType < +EnquiryType.Media || this.enquiryType == +EnquiryType.GroundVictim) {
                UtilityService.setModelFromFormGroup<EnquiryModel>(this.enquiry, this.form,
                    (x) => x.IsAdminRequest,
                    (x) => x.IsCallBack,
                    (x) => x.IsTravelRequest,
                    (x) => x.Queries);
            }
            else {
                UtilityService.setModelFromFormGroup<EnquiryModel>(this.enquiry, this.form, (x) => x.Queries);
                this.enquiry.IsCallBack = false;
                this.enquiry.IsAdminRequest = false;
                this.enquiry.IsTravelRequest = false;
            }

            this.enquiry.IncidentId = this.currentIncident;
            this.enquiry.Remarks = '';
            this.enquiry.CreatedBy = +this.credential.UserId;
            this.demands = new Array<DemandModel>();

            let communicationlogs = this.SetCommunicationLog
                (GlobalConstants.RequesterTypeEnquiry, GlobalConstants.InteractionDetailsTypeEnquiry);

            if (!this.isCallrecieved) {
                if (this.enquiryType == +EnquiryType.Passenger
                    || this.enquiryType == +EnquiryType.Cargo
                    || this.enquiryType == +EnquiryType.Crew
                    || this.enquiryType == +EnquiryType.GroundVictim) {
                    this.enquiry.CommunicationLogs = communicationlogs;
                    this.enquiry.CommunicationLogs[0].Queries = this.enquiry.Queries;
                }

                this.externalInput.deleteAttributes();
                this.externalInput.IsCallRecieved = true;
                this.externalInput.ExternalInputId = this.callid;

                if (this.enquiryType == +EnquiryType.Passenger && this.consolidatedCopassengers.length > 0) {
                    let enquiryModelsToSave: EnquiryModel[] = [];
                    let PDAEnquiryToUpdate: PDAEnquiryModel = new PDAEnquiryModel();

                    this.selectedCoPassangers = this.consolidatedCopassengers.filter(x => x.IsSelected == true);

                    enquiryModelsToSave = this.SetEnquiryforCoPassangers(this.enquiry);
                    enquiryModelsToSave.push(this.enquiry);

                    PDAEnquiryToUpdate.deleteAttributes();
                    PDAEnquiryToUpdate.AffectedPersonId = this.enquiry.AffectedPersonId;

                    this.enquiryService.CreateBulk(enquiryModelsToSave)
                        .flatMap(_ => this.GetCoPassangersByAffectedPersonId(this.enquiry.AffectedPersonId))
                        .flatMap(_ => this.callcenteronlypageservice.Update(this.externalInput, this.callid))
                        .flatMap(_ => this.callcenteronlypageservice.updatepdaenquiry(PDAEnquiryToUpdate, this.pdaenquiryid))
                        .subscribe(() => {

                            this.toastrService.success('Enquiry Saved successfully.', 'Success', this.toastrConfig);
                            let num = UtilityService.UUID();
                            this.globalState.NotifyDataChanged(GlobalConstants.DataExchangeConstant.CallRecieved, num);

                            if (this.selectedCoPassangers.filter(x => x.AffectedPersonId == this.enquiry.AffectedPersonId).length == 0) {
                                let obj = this.affectedPeople.find(x => x.AffectedPersonId == this.enquiry.AffectedPersonId); // this.initialvalue.Value
                                this.selectedCoPassangers.push(obj);
                            }

                            if (this.selectedCoPassangers.length > 0) {
                                let afftedIdstocreateDemand: number[] = [];
                                this.selectedCoPassangers.map(x => afftedIdstocreateDemand.push(x.AffectedPersonId));
                                this.CreateDemandsOnEnquery(this.affectedId, afftedIdstocreateDemand);
                            }
                            else {
                                this.CreateDemandsOnEnquery(this.enquiry.AffectedPersonId);
                            }
                        }, (error: any) => {
                            console.log(`Error: ${error.message}`);
                        });

                    let num = UtilityService.UUID();
                    this.globalState.NotifyDataChanged(GlobalConstants.DataExchangeConstant.CallRecieved, num);
                    this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.ClearAutoCompleteInput, '');

                } else {
                    let PDAEnquiryToUpdate: PDAEnquiryModel = new PDAEnquiryModel();
                    PDAEnquiryToUpdate.deleteAttributes();

                    if (this.enquiryType != +EnquiryType.Passenger
                        && this.enquiryType != +EnquiryType.Crew) {
                        delete this.enquiry.AffectedPersonId;
                    }
                    if (this.enquiryType != +EnquiryType.Cargo) {
                        delete this.enquiry.AffectedObjectId;
                    }
                    if (this.enquiryType != +EnquiryType.GroundVictim) {
                        delete this.enquiry.GroundVictimId;
                    }

                    //Not required
                    PDAEnquiryToUpdate.AffectedPersonId = this.enquiry.AffectedPersonId;

                    this.enquiryService.Create(this.enquiry)
                        .flatMap(_ => this.callcenteronlypageservice.Update(this.externalInput, this.callid))
                        .flatMap(_ => {
                            if (this.enquiryType == +EnquiryType.Passenger) {
                                return this.callcenteronlypageservice.updatepdaenquiry(PDAEnquiryToUpdate, this.pdaenquiryid)
                            } else {
                                return Observable.of(new PDAEnquiryModel());
                            }

                        }).subscribe(() => {
                            this.form = this.formInitialization();
                            this.toastrService.success('Enquiry Saved successfully.', 'Success', this.toastrConfig);
                            let num = UtilityService.UUID();

                            this.globalState.NotifyDataChanged(GlobalConstants.DataExchangeConstant.CallRecieved, num);
                            this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.ClearAutoCompleteInput, '');
                            let affId: number;

                            if (this.enquiry.AffectedPersonId > 0) {
                                affId = this.enquiry.AffectedPersonId;
                            } else {
                                affId = this.affectedId;
                            }
                            this.CreateDemandsOnEnquery(affId); // this.affectedId
                        }, (error: any) => {
                            console.log(`Error: ${error.message}`);
                        });
                }
            }
            else {

                this.enquiryToUpdate.Queries = this.enquiry.Queries;
                debugger;
                if ((this.enquiryType == +EnquiryType.Passenger || this.enquiryType == +EnquiryType.Crew)
                    && this.enquiry.AffectedPersonId && this.initialvalue.Value) {
                    this.enquiry.AffectedPersonId = this.initialvalue.Value;
                }

                if (this.enquiryType != +EnquiryType.Passenger) {
                    let communicationlogToDeactivate = new CommunicationLogModel();
                    communicationlogToDeactivate.deleteAttributes();
                    communicationlogToDeactivate.InteractionDetailsId = this.communicationlogstoupdateId[0];
                    communicationlogToDeactivate.ActiveFlag = 'InActive';

                    if (this.enquiry.AffectedPersonId && this.enquiry.AffectedPersonId != 0) {
                        this.enquiryToUpdate.AffectedPersonId = this.enquiry.AffectedPersonId;
                        communicationlogs[0].AffectedPersonId = this.enquiry.AffectedPersonId;

                        delete communicationlogs[0].AffectedObjectId;
                        delete communicationlogs[0].GroundVictimId;
                    }
                    if (this.enquiry.AffectedObjectId && this.enquiry.AffectedObjectId != 0) {
                        this.enquiryToUpdate.AffectedObjectId = this.enquiry.AffectedObjectId;
                        communicationlogs[0].AffectedObjectId = this.enquiry.AffectedObjectId;

                        delete communicationlogs[0].AffectedPersonId;
                        delete communicationlogs[0].GroundVictimId;
                    }
                    if (this.enquiry.GroundVictimId && this.enquiry.GroundVictimId != 0) {
                        this.enquiryToUpdate.GroundVictimId = this.enquiry.GroundVictimId;
                        communicationlogs[0].GroundVictimId = this.enquiry.GroundVictimId;

                        delete communicationlogs[0].AffectedPersonId;
                        delete communicationlogs[0].AffectedObjectId;
                    }
                    delete this.enquiryToUpdate.CommunicationLogs;

                    if (this.enquiryType < +EnquiryType.Media || this.enquiryType == +EnquiryType.GroundVictim) {
                        communicationlogs[0].Queries = this.enquiryToUpdate.Queries;
                        communicationlogs[0].EnquiryId = this.enquiryToUpdate.EnquiryId;
                    }
                    else {
                        this.enquiryToUpdate.AffectedPersonId = null;
                        this.enquiryToUpdate.AffectedObjectId = null;
                        this.enquiryToUpdate.GroundVictimId = null;
                    }

                    this.enquiryService.Update(this.enquiryToUpdate, this.enquiryToUpdate.EnquiryId)
                        .subscribe((item) => {

                            if (this.enquiryType < +EnquiryType.Media || this.enquiryType == +EnquiryType.GroundVictim) {
                                this.communicationlogservice
                                    .Update(communicationlogToDeactivate, this.communicationlogstoupdateId[0])
                                    .subscribe(() => {
                                        this.communicationlogservice.Create(communicationlogs[0]).subscribe();
                                    }, (error: any) => {
                                        console.log(`Error: ${error.message}`);
                                    });
                            }

                            this.form = this.formInitialization();
                            this.toastrService.success('Enquiry updated successfully.', 'Success', this.toastrConfig);
                            let num = UtilityService.UUID();

                            this.globalState.NotifyDataChanged(GlobalConstants.DataExchangeConstant.CallRecieved, num);
                            this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.ClearAutoCompleteInput, '');
                        }, (error: any) => {
                            console.log(`Error: ${error.message}`);
                        });
                }
                else if (this.enquiryType == +EnquiryType.Passenger) {
                    let enquiryModelsToSaveEdit: EnquiryModel[] = [];
                    let pdaenquirytoupdateEdit: PDAEnquiryModel = new PDAEnquiryModel();

                    this.selectedCoPassangers = this.consolidatedCopassengers.filter(x => x.IsSelected == true);
                    enquiryModelsToSaveEdit = this.SetEnquiryforCoPassangers(this.enquiry);

                    this.enquiry.CommunicationLogs = communicationlogs;
                    this.enquiry.CommunicationLogs[0].Queries = this.enquiry.Queries;
                    enquiryModelsToSaveEdit.push(this.enquiry);

                    pdaenquirytoupdateEdit.deleteAttributes();
                    pdaenquirytoupdateEdit.AffectedPersonId = this.enquiry.AffectedPersonId;

                    enquiryModelsToSaveEdit.forEach(x => {
                        x.EnquiryId = 0;
                        x.ExternalInputId = this.callid;
                        x.ActiveFlag = 'Active';
                        x.CreatedOn = new Date();
                        x.CreatedBy = +UtilityService.GetFromSession('CurrentUserId');
                        x.EnquiryType = this.enquiryType;
                        x.CallerId = this.caller.CallerId;
                        x.NextOfKinId = null;
                    });

                    this.enquiryService.UpdateBulkToDeactivateFromExternalId(this.callid)
                        .flatMap(_ => {
                            return this.enquiryService.CreateBulk(enquiryModelsToSaveEdit);
                        }).flatMap(_ => {
                            if (this.consolidatedCopassengers.length > 0) {
                                return this.GetCoPassangersByAffectedPersonId(this.enquiry.AffectedPersonId);
                            }
                            else if (this.consolidatedCopassengers.length == 0 && this.initialgroupId != 0) {
                                return this.passangerService.deleteoldgroups(this.initialgroupId);
                            }
                            else {
                                return Observable.of(new Array<CoPassengerMappingModel>());
                            }
                        }).flatMap(_ => {

                            if (this.pdaenquery.AffectedPersonId != null
                                && this.pdaenquery.AffectedPersonId != this.enquiry.AffectedPersonId) {
                                return this.callcenteronlypageservice.updatepdaenquiry(pdaenquirytoupdateEdit, this.pdaenquiryid);
                            }
                            else {
                                return Observable.of(new PDAEnquiryModel());
                            }
                        })
                        .subscribe(() => {
                            this.toastrService.success('Enquiry Saved successfully.', 'Success', this.toastrConfig);
                            let num = UtilityService.UUID();

                            this.globalState.NotifyDataChanged(GlobalConstants.DataExchangeConstant.CallRecieved, num);
                            this.dataExchange.Publish(GlobalConstants.DataExchangeConstant.ClearAutoCompleteInput, '');
                        }, (error: any) => {
                            console.log(`Error: ${error.message}`);
                        });
                }
            }
        }
        else {
            this.toastrService.info("* marked fields are mandatory.");
        }
    }

    //ui-copassanger related functions
    selectCopassengerpnr($event: any, copassenger: AffectedPeopleToView): void {
        copassenger.IsSelected = !copassenger.IsSelected;
        this.selectedcountpnr = this.copassengerlistpnr.filter(x => x.IsSelected == true).length;
        this.consolidatedCopassengers = [];

        if (copassenger.GroupId > 0) {
            this.SelectPeopleWithSameGroupId(copassenger.GroupId, copassenger.IsSelected, false);

        }
        this.PopulateConsolidatedCoPassangers();
    }

    public ShowListsOfSamePNR($event): void {
        this.isPaxWithSamePNRSelected = !this.isPaxWithSamePNRSelected;
        jQuery('ul.dropdown-menu-down').hide();
        jQuery($event.currentTarget).siblings('ul.dropdown-menu-down').show();
    }

    public SelectCoPassengerFromSelectedPassenger($event: any, copassenger: AffectedPeopleToView): void {
        copassenger.IsSelected = !copassenger.IsSelected;
        this.consolidatedCopassengers = [];
        if (copassenger.GroupId > 0 && copassenger.IsSelected) {
            this.SelectPeopleWithSameGroupId(copassenger.GroupId, copassenger.IsSelected, false);
        }
        this.PopulateConsolidatedCoPassangers();
    }

    public ShowPassengers($event): void {
        this.isCoPaxSelected = !this.isCoPaxSelected;
        jQuery('ul.dropdown-menu-down').hide();
        jQuery($event.currentTarget).siblings('ul.dropdown-menu-down').show();
    }

    public SelectAllCoPassengers($event: any, copassenger: AffectedPeopleToView): void {
        copassenger.IsSelected = !copassenger.IsSelected;
    }

    showListall(): void {
        this.totallistselected = !this.totallistselected;
    }

    addzero(num: number): string {
        let str: string = num.toString();
        if (num < 10) {
            str = '0' + str;
        }
        return str;
    }
}