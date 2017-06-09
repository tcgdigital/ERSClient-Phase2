import { Component, ViewEncapsulation, Input, OnInit, OnDestroy, ViewChild, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import {
    FormGroup, FormControl, FormBuilder, Validators
} from '@angular/forms';
import * as moment from 'moment/moment';
import { IncidentModel } from './incident.model';
import { EmergencyTypeModel, EmergencyTypeService } from '../../masterdata';
import { DateTimePickerSelectEventArgs } from '../../../shared/directives/datetimepicker';
import { EmergencyLocationService, EmergencyLocationModel } from '../../masterdata/emergencylocation';
import { IncidentService } from './incident.service';
import {
    OrganizationModel,
    OrganizationService,
    AircraftTypeModel,
    AircraftTypeService
} from "../../shared.components";
import { AffectedModel } from "../../shared.components/affected";
import {
    ResponseModel,
    GlobalStateService,
    GlobalConstants,
    Severity,
    KeyValue,
    KeyVal,
    IncidentStatus,
    InvolvedPartyType,
    UtilityService,
    LocationService,
    Location,
    DateTimePickerOptions
} from '../../../shared';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { FlightModel, InvolvePartyModel } from '../../shared.components';
import { IncidentDataExchangeModel } from './incidentDataExchange.model';

@Component({
    selector: 'incident-entry',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../styles/incident.style.scss'],
    templateUrl: '../views/incident.entry.html'
})
export class IncidentEntryComponent implements OnInit, OnDestroy {
    @ViewChild('childModalViewIncident') public childModalViewIncident: ModalDirective;
    @ViewChild('childModalViewWeatherLocation') public childModalViewWeatherLocation: ModalDirective;
    incident: IncidentModel;
    lat: number = 51.678418;
    lng: number = 7.809007;
    zoom: number = 8;
    public submitted: boolean = false;
    public submittedFlight: boolean = false;
    public isBorrowedIncidentPopup: boolean = false;
    //public IsReadonlyFlight:boolean;
    currentDepartmentId: number;
    location: Location;
    datePickerOption: any = {
        timepicker: true,
        format12h: true,
        fullDays: false,
        language: 'en',
        hourStep: 1,
        minuteStep: 1
    };
    datepickerOptionED: DateTimePickerOptions = new DateTimePickerOptions();
    datepickerOptionFLT: DateTimePickerOptions = new DateTimePickerOptions();
    disableIsDrill: boolean;
    disableIsDrillPopup: boolean;
    isFlightRelated: boolean = false;
    isFlightRelatedPopup: boolean = false;
    isOffsite: boolean = false;
    isOffSitePopup: boolean = false;
    buttonValue: string = '';
    incidentModel: IncidentModel = null;
    involvePartyModel: InvolvePartyModel = null;
    incidentDataExchangeModel: IncidentDataExchangeModel = null;
    flightModel: FlightModel = null;
    affectedModel: AffectedModel = null;
    date: Date = new Date();
    activeEmergencyTypes: EmergencyTypeModel[] = [];
    activeOrganizations: OrganizationModel[] = [];
    activeAircraftTypes: AircraftTypeModel[] = [];
    incidentsToPickForReplication: IncidentModel[] = [];
    severities: KeyValue[] = [];
    incidentStatuses: KeyValue[] = [];
    affectedStations: EmergencyLocationModel[] = [];
    public form: FormGroup;
    public formFlight: FormGroup;
    public formPopup: FormGroup;
    public flightClass: {};
    //public EmergencyDate: Date;
    //public hasEmergencyDateValue = false;
    public EmergencyDateCompare: Date;
    public ArrivalDate: Date;
    public DepartureDate: Date;
    public ArrivalDateCompare: Date;
    public DepartureDateCompare: Date;
    public globalStateProxy: GlobalStateService;
    public IsDrillPopup: boolean;
    public isBorrowed: boolean;
    public EmergencyDateLocal: Date;
    public ReportedDateLocal: Date;
    public ScheduleDepartureLocal: Date;
    public ScheduleArrivalLocal: Date;
    public lastCount: string = GlobalConstants.LAST_INCIDENT_PICK_COUNT;
    /**
     * Creates an instance of IncidentEntryComponent.
     * @param {FormBuilder} formBuilder
     * @param {EmergencyTypeService} emergencyTypeService
     * @param {DataExchangeService<IncidentDataExchangeModel>} dataExchange
     * @param {DataExchangeService<Boolean>} dataExchangeDecision
     *
     * @memberOf IncidentEntryComponent
     */
    constructor(formBuilder: FormBuilder,
        private router: Router,
        private incidentService: IncidentService,
        private emergencyTypeService: EmergencyTypeService,
        private injector: Injector,
        private emergencyLocationService: EmergencyLocationService,
        private locationService: LocationService,
        private toastrConfig: ToastrConfig,
        private toastrService: ToastrService,
        private organizationService: OrganizationService,
        private aircraftTypeService: AircraftTypeService) {
        this.severities = UtilityService.GetKeyValues(Severity);
        this.incidentStatuses = UtilityService.GetKeyValues(IncidentStatus);
        this.affectedStations = [];


        this.datepickerOptionED = new DateTimePickerOptions();
        this.datepickerOptionFLT = new DateTimePickerOptions();
        // This proxy is created for not create the GlobalStateService in constructor level and reuse the 
        // GlobalStateService.
        this.globalStateProxy = injector.get(GlobalStateService);
    }

    ngOnInit(): void {
        //this.IsReadonlyFlight=false;
        this.submitted = false;
        this.EmergencyDateLocal = new Date();
        this.submittedFlight = false;
        this.flightClass = { 'is-disabled': false };
        this.isBorrowed = false;
        this.datepickerOptionED.maxDate = new Date();
        this.datepickerOptionFLT.position = 'top left';
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.isFlightRelated = false;
        this.disableIsDrill = true;
        this.disableIsDrillPopup = true;
        this.IsDrillPopup = false;
        this.isOffsite = false;
        let d = new Date();
        let tomorrowDate = d.getDate() + 1000;
        d.setDate(tomorrowDate);
        this.EmergencyDateCompare = new Date(d);
        this.ArrivalDateCompare = new Date(d);
        this.DepartureDateCompare = new Date(d);
        this.initiateIncidentModel();
        this.getAllActiveEmergencyTypes();
        this.getAllActiveOrganizations();
        this.getAllActiveAircraftTypes();
        this.resetIncidentForm();
        this.resetFlightForm();
        this.resetIncidentViewForm();

        this.emergencyLocationService.GetAllActiveEmergencyLocations()
            .subscribe((result: ResponseModel<EmergencyLocationModel>) => {
                result.Records.forEach((item: EmergencyLocationModel) => {
                    const emergencyLocationModel: EmergencyLocationModel = new EmergencyLocationModel();
                    emergencyLocationModel.IATA = item.IATA;
                    emergencyLocationModel.AirportName = item.AirportName;
                    this.affectedStations.push(emergencyLocationModel);
                });
            });

    }

    initiateIncidentModel(): void {
        this.incidentModel = new IncidentModel();
        this.incidentModel.IncidentStatus = UtilityService.GetKeyValues(IncidentStatus)[0].Key;
        this.incidentModel.Severity = UtilityService.GetKeyValues(Severity)[0].Key;
    }

    getAllActiveEmergencyTypes(): void {
        this.emergencyTypeService.GetAllActive()
            .subscribe((response: ResponseModel<EmergencyTypeModel>) => {
                this.activeEmergencyTypes = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    getAllActiveOrganizations(): void {
        this.organizationService.GetAllActiveOrganizations()
            .subscribe((response: ResponseModel<OrganizationModel>) => {
                this.activeOrganizations = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    getIncidentsToPickForReplication(isFlightRelated: boolean, emergencyTypeId: string): boolean {
        if (emergencyTypeId == '') {
            this.incidentsToPickForReplication = [];
            this.isBorrowed = false;
            return false;
        }
        this.incidentService.GetLastConfiguredCountIncidents()
            .subscribe((response: ResponseModel<IncidentModel>) => {
                this.incidentsToPickForReplication = [];

                let internalCount: number = 0;
                this.isBorrowed = false;
                if (response.Count > 0) {
                    this.isBorrowed = true;
                }
                for (let i: number = 0; internalCount < +this.lastCount; i++) {
                    if (response.Records[i].InvolvedParties.length > 0) {
                        if (isFlightRelated) {
                            if (response.Records[i].InvolvedParties[0].InvolvedPartyType == 'Flight') {
                                this.incidentsToPickForReplication.push(response.Records[i]);
                                internalCount++;
                            }
                        }
                        else {
                            if (response.Records[i].InvolvedParties[0].InvolvedPartyType == 'NonFlight') {
                                this.incidentsToPickForReplication.push(response.Records[i]);
                                internalCount++;
                            }
                        }
                    }
                }
                // response.Records.forEach((item: IncidentModel)=>{
                //     if(item.InvolvedParties.length>0){
                //         if(isFlightRelated){
                //             if(item.InvolvedParties[0].InvolvedPartyType=='Flight'){
                //                 this.incidentsToPickForReplication.push(item);
                //             }
                //         }
                //         else{
                //             if(item.InvolvedParties[0].InvolvedPartyType=='NonFlight'){
                //                 this.incidentsToPickForReplication.push(item);
                //             }
                //         }
                //     }
                // });
                this.incidentsToPickForReplication.map((item: IncidentModel) => {
                    if (item.ClosedOn != null) {
                        item.EmergencyName = item.EmergencyName + ' (closed)';
                    }
                });
                this.incidentModel.BorrowedIncident = 0;
            });
    }

    getAllActiveAircraftTypes(): void {
        this.aircraftTypeService.GetAllActiveAircraftTypes()
            .subscribe((response: ResponseModel<AircraftTypeModel>) => {
                this.activeAircraftTypes = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    emergencyTypeChange(emergencyTypeId: string, emergencyTypes: EmergencyTypeModel[]): void {
        const emergencyType: EmergencyTypeModel = emergencyTypes
            .find((x: EmergencyTypeModel) => x.EmergencyTypeId === +emergencyTypeId);
        this.submittedFlight = false;
        if (emergencyType !== undefined && emergencyType.EmergencyCategory === 'FlightRelated') {
            this.isFlightRelated = true;
        }
        else {
            this.isFlightRelated = false;
        }
        this.getIncidentsToPickForReplication(this.isFlightRelated, emergencyTypeId);
    }


    affectedStationChange(IATAVal: string, affectedStations: EmergencyLocationModel[]): void {
        if (IATAVal === 'Offsite') {
            this.isOffsite = true;
        }
        else {
            this.isOffsite = false;
        }
    }

    organizationChange(organizationId: string, activeOrganizations: OrganizationModel[]): void {
        const activeOrganization: OrganizationModel = activeOrganizations
            .find((x: OrganizationModel) => x.OrganizationId === +organizationId);
    }

    aircraftTypeChange(activeAircraftTypeId: string, activeAircraftTypes: AircraftTypeModel[]): void {
        const activeAircraftType: AircraftTypeModel = activeAircraftTypes
            .find((x: AircraftTypeModel) => x.AircraftTypeId === +activeAircraftTypeId);
    }

    incidentsToPickForReplicationChange(incidentId: string, incidentsToPickForReplication: IncidentModel[]): void {
        this.isBorrowedIncidentPopup = false;
        if (this.isFlightRelated) {
            this.submittedFlight = false;
            if (incidentId != '0') {
                this.ResetFlightFields();

                const incidentToPickForReplication: IncidentModel = incidentsToPickForReplication
                    .find((x: IncidentModel) => x.IncidentId === +incidentId);
                this.incidentService.GetFlightInfoFromIncident(+incidentId)
                    .subscribe((itemFlight: FlightModel) => {
                        this.FillFlightFields(itemFlight);
                        this.isBorrowedIncidentPopup = true;
                    });
            }
            else {
                this.ResetFlightFields();
                this.isBorrowedIncidentPopup = false;
            }
        }



    }

    public ResetFlightFields(): void {
        //this.IsReadonlyFlight=false;
        this.flightClass = { 'is-disabled': false };
        this.formFlight = new FormGroup({
            FlightNumber: new FormControl('', [Validators.required]),
            Origin: new FormControl('', [Validators.required]),
            Destination: new FormControl('', [Validators.required]),
            Scheduleddeparture: new FormControl('', [Validators.required]),
            Scheduledarrival: new FormControl('', [Validators.required]),
            FlightTailNumber: new FormControl(''),
            AircraftTypeId: new FormControl('', [Validators.required]),
            ScheduleddepartureLOC: new FormControl(''),
            ScheduledarrivalLOC: new FormControl('')
        });
    }

    public FillFlightFields(itemFlight: FlightModel): void {
        //this.IsReadonlyFlight=true;
        this.flightClass = { 'is-disabled': true };
        this.ScheduleDepartureLocal = new Date(new Date(itemFlight.DepartureDate).toLocaleString() + " UTC");
        this.ScheduleArrivalLocal = new Date(new Date(itemFlight.ArrivalDate).toLocaleString() + " UTC");
        this.formFlight = new FormGroup({
            FlightNumber: new FormControl(itemFlight.FlightNo),
            Origin: new FormControl(itemFlight.OriginCode),
            Destination: new FormControl(itemFlight.DestinationCode),
            Scheduleddeparture: new FormControl(moment(itemFlight.DepartureDate).format('YYYY-MM-DD h:mm A')),
            Scheduledarrival: new FormControl(moment(itemFlight.ArrivalDate).format('YYYY-MM-DD h:mm A')),
            FlightTailNumber: new FormControl(itemFlight.FlightTaleNumber),
            AircraftTypeId: new FormControl(itemFlight.AircraftTypeId),
            ScheduleddepartureLOC: new FormControl(moment(this.ScheduleDepartureLocal).format('YYYY-MM-DD h:mm A')),
            ScheduledarrivalLOC: new FormControl(moment(this.ScheduleArrivalLocal).format('YYYY-MM-DD h:mm A'))
        });

    }

    public IsDrill(event: any): void {
        console.log(event.checked);
    }

    checkBoxMouseDown(event: any): void {
        event.stopPropagation();
    }

    ngOnDestroy() { }

    ShowWeatherLocation(): void {
        this.childModalViewWeatherLocation.show();
    }

    hideViewWeatherLocation(): void {
        this.childModalViewWeatherLocation.hide();
    }

    onIncidentViewPreCheck(isInsertShow: boolean): void { }

    resetIncidentForm(): void {
        this.isOffsite = false;
        this.form = new FormGroup({
            IncidentId: new FormControl(0),
            IsDrill: new FormControl(false),
            EmergencyTypeId: new FormControl('', [Validators.required]),
            AffectedStationId: new FormControl('', [Validators.required]),
            OffsiteDetails: new FormControl(''),
            EmergencyName: new FormControl('', [Validators.required]),
            //AlertMessage: new FormControl('', [Validators.required]),
            WhatHappened: new FormControl('', [Validators.required]),
            WhereHappened: new FormControl(''),
            OtherConfirmationInformation: new FormControl(''),
            ReportedDate: new FormControl('', [Validators.required]),
            ReportedDateLocal: new FormControl(''),

            Description: new FormControl('', [Validators.required]),
            EmergencyDate: new FormControl('', [Validators.required]),
            Severity: new FormControl(''),
            OrganizationId: new FormControl('', [Validators.required]),


            SourceInformation: new FormControl(''),
            ReportedByName: new FormControl(''),
            ReportedByAddress: new FormControl(''),
            ContactOfWitness: new FormControl(''),
            SenderOfCrisisInformation: new FormControl(''),
            BorrowedIncident: new FormControl(0),
            EmergencyDateLocal: new FormControl(''),
            //AirportInCharge: new FormControl('', [Validators.required]),
            //CrisisReporterIdentity: new FormControl('', [Validators.required]),
            IncidentsToPickForReplication: new FormControl('')

        });
    }

    resetFlightForm(): void {
        this.formFlight = new FormGroup({
            FlightNumber: new FormControl('', [Validators.required]),
            Origin: new FormControl('', [Validators.required]),
            Destination: new FormControl('', [Validators.required]),
            Scheduleddeparture: new FormControl('', [Validators.required]),
            Scheduledarrival: new FormControl('', [Validators.required]),
            FlightTailNumber: new FormControl('', [Validators.required]),
            AircraftTypeId: new FormControl('', [Validators.required]),
            ScheduleddepartureLOC: new FormControl(''),
            ScheduledarrivalLOC: new FormControl('')
        });
    }
    cancel(): void {
        this.submitted = false;
        this.resetIncidentForm();
        if (this.isFlightRelated) {
            this.submittedFlight = false;
            //this.resetFlightForm();
            this.ResetFlightFields();
        }

    }
    onSubmit(): void {
        debugger;
        this.submitted = true;
        this.submittedFlight = true;
        //let tt:string = this.form.controls['EmergencyDate'].value;

        if (this.form.valid && this.isFlightRelated == false) {
            this.submitted = false;
            this.submittedFlight = false;
            this.proceed();
        }
        else if (this.form.valid && this.formFlight.valid && this.isFlightRelated) {


            this.submitted = false;
            this.submittedFlight = false;
            this.proceed();
        }
    }

    proceed() {
        this.isFlightRelatedPopup = false;
        this.isFlightRelatedPopup = this.isFlightRelated;
        this.createIncidentModel();
        if (this.isFlightRelated) {
            this.createInvolvepartyAndFlight();
        }

        this.fillIncidentDataExchangeModelData(this.incidentModel, this.involvePartyModel,
            this.flightModel, this.affectedModel);
        this.childModalViewIncident.show();
        this.loadDataIncidentViewPopup();
    }

    createInvolvepartyAndFlight() {
        this.createInvolvePartyModel(this.isFlightRelated);
        this.createFlightModel();
        this.createAffectedModel();
    }

    onPOPUPSubmit(values: object): void {
        debugger;
        console.log('Incident Created.');
        console.log(this.incidentDataExchangeModel);
        if (this.incidentDataExchangeModel.IncidentModel.EmergencyLocation === 'Offsite') {
            this.incidentDataExchangeModel.IncidentModel.EmergencyLocation = this.incidentDataExchangeModel.IncidentModel.OffSetLocation;
            delete this.incidentDataExchangeModel.IncidentModel.OffSetLocation;
        }
        this.incidentService.CreateIncident(this.incidentDataExchangeModel.IncidentModel,
            this.incidentDataExchangeModel.IsFlightRelated,
            this.incidentDataExchangeModel.InvolvedPartyModel, this.incidentDataExchangeModel.FLightModel,
            this.incidentDataExchangeModel.AffectedModel)
            .subscribe((response: IncidentModel) => {
                console.log(response);
                console.log("Success");
                this.globalStateProxy.NotifyDataChanged('incidentCreate', response.IncidentId);
                console.log('Success');
                this.router.navigate(['pages/dashboard']);
            }, (error: any) => {
                console.log('Error');
            });
    }



    fillIncidentDataExchangeModelData(incidentModel: IncidentModel,
        involvedPartyModel?: InvolvePartyModel, flightModel?: FlightModel, affectedModel?: AffectedModel): void {
        this.incidentDataExchangeModel = new IncidentDataExchangeModel();
        this.incidentDataExchangeModel.IncidentModel = incidentModel;
        this.incidentDataExchangeModel.InvolvedPartyModel = involvedPartyModel;
        this.incidentDataExchangeModel.FLightModel = flightModel;
        this.incidentDataExchangeModel.AffectedModel = affectedModel;
        this.incidentDataExchangeModel.IsFlightRelated = this.isFlightRelated;
        console.log('Going to the View page.........................');
        //this.dataExchangeDecision.Publish('instructionToCloseInsertOpenViewCommand', true);
        //this.dataExchange.Publish('incidentCreatedPreCheck', this.incidentDataExchangeModel);
    }

    resetIncidentViewForm(): void {
        this.formPopup = new FormGroup({
            IncidentId: new FormControl(0),
            IsDrill: new FormControl(false),
            EmergencyTypeIdPopup: new FormControl('0'),
            AffectedStationIdPopup: new FormControl(''),
            //OffsiteDetailsPopup: new FormControl(''),
            EmergencyNamePopup: new FormControl(''),
            //AlertMessagePopup: new FormControl(''),
            WhatHappenedPopup: new FormControl(''),
            WhereHappenedPopup: new FormControl(''),
            OtherConfirmationInformationPopup: new FormControl(''),
            ReportedDatePopup: new FormControl(''),
            ReportedDateLocalPopup: new FormControl(''),

            DescriptionPopup: new FormControl(''),
            EmergencyDatePopup: new FormControl(''),
            SeverityPopup: new FormControl('0'),
            OrganizationIdPopup: new FormControl(''),


            SourceInformationPopup: new FormControl(''),
            ReportedByNamePopup: new FormControl(''),
            ReportedByAddressPopup: new FormControl(''),
            ContactOfWitnessPopup: new FormControl(''),
            SenderOfCrisisInformationPopup: new FormControl(''),
            BorrowedIncidentPopup: new FormControl(''),
            EmergencyDateLocalPopup: new FormControl(''),
            //AirportInChargePopup: new FormControl(''),
            //CrisisReporterIdentityPopup: new FormControl(''),
            IncidentsToPickForReplication: new FormControl(''),
            FlightNumberPopup: new FormControl(''),
            OriginPopup: new FormControl(''),
            DestinationPopup: new FormControl(''),
            ScheduleddeparturePopup: new FormControl(''),
            ScheduledarrivalPopup: new FormControl(''),
            FlightTailNumberPopup: new FormControl(''),
            AircraftTypeIdPopup: new FormControl(''),
            ScheduleddepartureLOCPopup: new FormControl(''),
            ScheduledarrivalLOCPopup: new FormControl('')
        });
        this.IsDrillPopup = false;
    }

    loadDataIncidentViewPopup() {
        // let offsetVal: string = '';
        this.disableIsDrill = true;
        this.isOffSitePopup = false;
        if (this.incidentDataExchangeModel.IncidentModel.EmergencyLocation === 'Offsite') {
            this.isOffSitePopup = true;
        }
        this.formPopup = new FormGroup({

            IncidentId: new FormControl(this.incidentDataExchangeModel.IncidentModel.IncidentId),
            EmergencyTypeIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyTypeId),
            AffectedStationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyLocation),
            OffsiteDetailsPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OffSetLocation),
            EmergencyNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyName),
            //AlertMessagePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.AlertMessage),

            WhatHappenedPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhatHappend),
            WhereHappenedPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhereHappend),
            OtherConfirmationInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OtherConfirmationInformation),
            ReportedDatePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedDate),
            ReportedDateLocalPopup: new FormControl(moment(this.ReportedDateLocal).format('YYYY-MM-DD h:mm a')),


            DescriptionPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Description),
            EmergencyDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).format('YYYY-MM-DD h:mm a')),
            ////Soumit
            EmergencyDateLocalPopup: new FormControl(moment(this.EmergencyDateLocal).format('YYYY-MM-DD h:mm a')),
            SeverityPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Severity),
            //AirportInChargePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.AirportInCharge),
            OrganizationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OrganizationId),

            SourceInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SourceInformation),
            ReportedByNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByName),
            ReportedByAddressPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByAddress),
            ContactOfWitnessPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ContactOfWitness),
            SenderOfCrisisInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SenderOfCrisisInformation),


            BorrowedIncidentPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.BorrowedIncident)
        });
        this.IsDrillPopup = this.incidentDataExchangeModel.IncidentModel.IsDrill;
        this.isFlightRelatedPopup = false;
        if (this.incidentDataExchangeModel.IsFlightRelated == true) {
            this.formPopup = new FormGroup({
                IncidentId: new FormControl(this.incidentDataExchangeModel.IncidentModel.IncidentId),
                EmergencyTypeIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyTypeId),
                AffectedStationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyLocation),
                OffsiteDetailsPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OffSetLocation),
                EmergencyNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyName),
                //AlertMessagePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.AlertMessage),

                WhatHappenedPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhatHappend),
                WhereHappenedPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhereHappend),
                OtherConfirmationInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OtherConfirmationInformation),
                ReportedDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.ReportedDate).format('YYYY-MM-DD h:mm a')),
                ReportedDateLocalPopup: new FormControl(moment(this.ReportedDateLocal).format('YYYY-MM-DD h:mm a')),



                DescriptionPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Description),
                EmergencyDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).format('YYYY-MM-DD h:mm a')),
                EmergencyDateLocalPopup: new FormControl(moment(this.EmergencyDateLocal).format('YYYY-MM-DD h:mm a')),

                SeverityPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Severity),
                //AirportInChargePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.AirportInCharge),
                OrganizationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OrganizationId),
                //CrisisReporterIdentityPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.CrisisReporterIdentity),

                SourceInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SourceInformation),
                ReportedByNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByName),
                ReportedByAddressPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByAddress),
                ContactOfWitnessPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ContactOfWitness),
                SenderOfCrisisInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SenderOfCrisisInformation),

                BorrowedIncidentPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.BorrowedIncident),


                FlightNumberPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.FlightNo),
                OriginPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.OriginCode),
                DestinationPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.DestinationCode),
                ScheduleddeparturePopup: new FormControl(moment(this.incidentDataExchangeModel.FLightModel.DepartureDate).format('YYYY-MM-DD h:mm a')),
                ScheduledarrivalPopup: new FormControl(moment(this.incidentDataExchangeModel.FLightModel.ArrivalDate).format('YYYY-MM-DD h:mm a')),
                FlightTailNumberPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.FlightTaleNumber),
                AircraftTypeIdPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.AircraftTypeId),
                ScheduleddepartureLOCPopup: new FormControl(moment(this.ScheduleDepartureLocal).format('YYYY-MM-DD h:mm a')),
                ScheduledarrivalLOCPopup: new FormControl(moment(this.ScheduleArrivalLocal).format('YYYY-MM-DD h:mm a'))
            });
            this.IsDrillPopup = this.incidentDataExchangeModel.IncidentModel.IsDrill;
            this.isFlightRelatedPopup = true;
        }
        if (this.isBorrowedIncidentPopup) {
            debugger;
            let id: number = +this.formPopup.controls['BorrowedIncidentPopup'].value;
            if (id) {
                let selectedIncident: IncidentModel = this.incidentsToPickForReplication.find((item: IncidentModel) => {
                    return item.IncidentId == id;
                });

                this.formPopup.controls["BorrowedIncidentPopup"].setValue(selectedIncident.EmergencyName);
            }
        }
        //this.isBorrowedIncidentPopup = false;
        // if (this.formFlight.controls['BorrowedIncidentPopup'].value!='') {
        //     this.isBorrowedIncidentPopup = true;
        // }
    }

    createInvolvePartyModel(isFlightRelated: boolean): void {
        this.involvePartyModel = new InvolvePartyModel();
        this.involvePartyModel.InvolvedPartyId = 0;
        this.involvePartyModel.IncidentId = 0;
        if (isFlightRelated) {
            this.involvePartyModel.InvolvedPartyDesc = 'FlightRelated';
            this.involvePartyModel.InvolvedPartyType = UtilityService.GetKeyValues(InvolvedPartyType)[0].Key;
        }
        else {
            this.involvePartyModel.InvolvedPartyDesc = 'NonFlightRelated';
            this.involvePartyModel.InvolvedPartyType = UtilityService.GetKeyValues(InvolvedPartyType)[1].Key;
        }
        this.involvePartyModel.ActiveFlag = 'Active';
        this.involvePartyModel.CreatedBy = 1;
        this.involvePartyModel.CreatedOn = this.date;
    }
    createAffectedModel(): void {
        this.affectedModel = new AffectedModel();
        this.affectedModel.AffectedId = 0;
        this.affectedModel.InvolvedPartyId = 0;
        this.affectedModel.Severity = this.form.controls['Severity'].value;
        this.affectedModel.ActiveFlag = 'Active';
        this.flightModel.CreatedBy = 1;
        this.flightModel.CreatedOn = this.date;
    }

    createFlightModel(): void {
        this.flightModel = new FlightModel();
        this.flightModel.FlightId = 0;
        this.flightModel.InvolvedPartyId = 0;
        this.flightModel.FlightNo = this.formFlight.controls['FlightNumber'].value;
        this.flightModel.OriginCode = this.formFlight.controls['Origin'].value;
        this.flightModel.DestinationCode = this.formFlight.controls['Destination'].value;
        this.flightModel.DepartureDate = new Date(this.formFlight.controls['Scheduleddeparture'].value);//this.DepartureDate;
        this.flightModel.ArrivalDate = new Date(this.formFlight.controls['Scheduledarrival'].value);//this.ArrivalDate;
        this.flightModel.FlightTaleNumber = this.formFlight.controls['FlightTailNumber'].value;
        this.flightModel.AircraftTypeId = this.formFlight.controls['AircraftTypeId'].value;
        this.flightModel.LoadAndTrimInfo = null;
        this.flightModel.ActiveFlag = 'Active';
        this.flightModel.CreatedBy = 1;
        this.flightModel.CreatedOn = this.date;
    }



    createIncidentModel(): void {
        this.initiateIncidentModel();
        this.incidentModel.IsDrill = this.form.controls['IsDrill'].value;
        this.incidentModel.EmergencyTypeId = Number(this.form.controls['EmergencyTypeId'].value);
        this.incidentModel.IncidentStatus = UtilityService.GetKeyValues(IncidentStatus)[0].Key;
        this.incidentModel.EmergencyName = this.form.controls['EmergencyName'].value;
        //this.incidentModel.AlertMessage = this.form.controls['AlertMessage'].value;

        this.incidentModel.WhatHappend = this.form.controls['WhatHappened'].value;
        this.incidentModel.WhereHappend = this.form.controls['WhereHappened'].value;
        this.incidentModel.OtherConfirmationInformation = this.form.controls['OtherConfirmationInformation'].value;
        this.incidentModel.ReportedDate = new Date(this.form.controls['ReportedDate'].value);

        this.incidentModel.Description = this.form.controls['Description'].value;
        this.incidentModel.EmergencyDate = new Date(this.form.controls['EmergencyDate'].value);
        this.incidentModel.Severity = this.form.controls['Severity'].value;
        if (this.form.controls['AffectedStationId'].value !== 'Offsite') {
            this.incidentModel.EmergencyLocation = this.form.controls['AffectedStationId'].value;
        }
        else {
            this.incidentModel.EmergencyLocation = this.form.controls['AffectedStationId'].value;
            this.incidentModel.OffSetLocation = this.form.controls['OffsiteDetails'].value;
        }

        //this.incidentModel.AirportInCharge = this.form.controls['AirportInCharge'].value;
        this.incidentModel.OrganizationId = +this.form.controls['OrganizationId'].value;
        //this.incidentModel.CrisisReporterIdentity = this.form.controls['CrisisReporterIdentity'].value;

        this.incidentModel.SourceInformation = this.form.controls['SourceInformation'].value;
        this.incidentModel.ReportedByName = this.form.controls['ReportedByName'].value;
        this.incidentModel.ReportedByAddress = this.form.controls['ReportedByAddress'].value;
        this.incidentModel.ContactOfWitness = this.form.controls['ContactOfWitness'].value;
        this.incidentModel.SenderOfCrisisInformation = this.form.controls['SenderOfCrisisInformation'].value;
        if(this.isBorrowedIncidentPopup){
            this.incidentModel.BorrowedIncident = +this.form.controls['BorrowedIncident'].value;
        }
        else{
            this.incidentModel.BorrowedIncident = null;
        }
        
        // if (this.incidentModel.EmergencyLocation === 'Offset') {
        //     this.incidentModel.OffSetLocation = this.form.controls['OffsiteDetails'].value;
        // }
        this.incidentModel.IsSubmitted = false;
        this.incidentModel.IsSaved = false;
        this.incidentModel.DepartmentId = Number(this.currentDepartmentId);
        this.incidentModel.ClosedBy = null;
        this.incidentModel.ClosedOn = null;
        this.incidentModel.ReOpenBy = null;
        this.incidentModel.ReOpenOn = null;
        this.incidentModel.ReClosedBy = null;
        this.incidentModel.ReClosedOn = null;
        this.incidentModel.SubmittedBy = null;
        this.incidentModel.SubmittedOn = null;
        this.incidentModel.SavedBy = null;
        this.incidentModel.SavedOn = null;
        this.incidentModel.ActiveFlag = 'Active';
        this.incidentModel.CreatedBy = 1;
        this.incidentModel.CreatedOn = this.date;
    }

    hideIncidentView(): void {
        this.childModalViewIncident.hide();
    }

    public dateTimeSet(date: DateTimePickerSelectEventArgs, controlName: string): void {
        if (controlName === 'EmergencyDate') {
            this.form.get("EmergencyDate")
                .setValue(moment(date.SelectedDate).format('YYYY-MM-DD h:mm A'));
            this.EmergencyDateLocal = new Date(date.SelectedDate.toLocaleString() + " UTC");
            this.form.get("EmergencyDateLocal")
                .setValue(moment(this.EmergencyDateLocal).format('YYYY-MM-DD h:mm A'));
        }
        else if (controlName === 'ReportedDate') {
            this.form.get("ReportedDate")
                .setValue(moment(date.SelectedDate).format('YYYY-MM-DD h:mm A'));
            this.ReportedDateLocal = new Date(date.SelectedDate.toLocaleString() + " UTC");
            this.form.get("ReportedDateLocal")
                .setValue(moment(this.ReportedDateLocal).format('YYYY-MM-DD h:mm A'));
        }
        else if (controlName === 'Scheduleddeparture') {
            this.formFlight.get("Scheduleddeparture")
                .setValue(moment(date.SelectedDate).format('YYYY-MM-DD h:mm A'));
            this.ScheduleDepartureLocal = new Date(date.SelectedDate.toLocaleString() + " UTC");
            this.formFlight.get("ScheduleddepartureLOC")
                .setValue(moment(this.ScheduleDepartureLocal).format('YYYY-MM-DD h:mm A'));
        }
        else if (controlName === 'Scheduledarrival') {
            this.formFlight.get("Scheduledarrival")
                .setValue(moment(date.SelectedDate).format('DD/MM/YYYY h:mm A'));
            this.ScheduleArrivalLocal = new Date(date.SelectedDate.toLocaleString() + " UTC");
            this.formFlight.get("ScheduledarrivalLOC")
                .setValue(moment(this.ScheduleArrivalLocal).format('YYYY-MM-DD h:mm A'));
        }
    }
}