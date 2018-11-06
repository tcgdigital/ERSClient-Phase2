import { Component, ViewEncapsulation, OnInit, OnDestroy, ViewChild, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';

import {
    FormGroup, FormControl, Validators
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
} from '../../shared.components';
import { AffectedModel } from '../../shared.components/affected';
import {
    ResponseModel,
    GlobalStateService,
    GlobalConstants,
    Severity,
    KeyValue,
    IncidentStatus,
    InvolvedPartyType,
    UtilityService,
    Location,
    DateTimePickerOptions,
    DateTimePickerDirective,
    AuthModel
} from '../../../shared';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FlightModel, InvolvePartyModel } from '../../shared.components';
import { IncidentDataExchangeModel } from './incidentDataExchange.model';
import { ZoneIndicator, TimeZoneService } from "../../shared.components/timezone";
import { Subject, Observable } from 'rxjs';

@Component({
    selector: 'incident-entry',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../styles/incident.style.scss'],
    templateUrl: '../views/incident.entry.html'
})
export class IncidentEntryComponent implements OnInit, OnDestroy {
    @ViewChild('childModalViewIncident') public childModalViewIncident: ModalDirective;
    @ViewChild('childModalViewWeatherLocation') public childModalViewWeatherLocation: ModalDirective;

    @ViewChild('emergencyDateTimePicker') public emergencyDateTimePicker: DateTimePickerDirective;
    @ViewChild('reportedDateTimePicker') public reportedDateTimePicker: DateTimePickerDirective;
    @ViewChild('scheduledDepartureDateTimePicker') public scheduledDepartureDateTimePicker: DateTimePickerDirective;
    @ViewChild('scheduledArrivalDateTimePicker') public scheduledArrivalDateTimePicker: DateTimePickerDirective;

    incident: IncidentModel;
    lat: number = 51.678418;
    lng: number = 7.809007;
    zoom: number = 8;
    public submitted: boolean = false;
    public submittedFlight: boolean = false;
    public isBorrowedIncidentPopup: boolean = true;
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
    datepickerOptionDeparture: DateTimePickerOptions = new DateTimePickerOptions();
    datepickerOptionArrival: DateTimePickerOptions = new DateTimePickerOptions();

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
    public EmergencyCountry: string = '';
    public dateTimePatternValidator = {
        'd': { pattern: new RegExp(/(([0]?[1-9])|([1-2][0-9])|(3[01]))/) },
        'M': { pattern: new RegExp(/(jan|feb|mar|apr|jun|jul|Aug|sep|oct|nov|dec)/) },
        'y': { pattern: new RegExp(/^(20[1-9]\d)$/) },
        'm': { pattern: new RegExp('\[0-59\]') },
        's': { pattern: new RegExp('\[0,59\]') }
    }
    credential: AuthModel;
    private ngUnsubscribe: Subject<any> = new Subject<any>();
    private preventOnBlurExecution: boolean = false;

    /**
     * Creates an instance of IncidentEntryComponent.
     * @param {FormBuilder} formBuilder
     * @param {EmergencyTypeService} emergencyTypeService
     * @param {DataExchangeService<IncidentDataExchangeModel>} dataExchange
     * @param {DataExchangeService<Boolean>} dataExchangeDecision
     *
     * @memberOf IncidentEntryComponent
     */
    constructor(private router: Router,
        private incidentService: IncidentService,
        private emergencyTypeService: EmergencyTypeService,
        private injector: Injector,
        private emergencyLocationService: EmergencyLocationService,
        private timeZoneService: TimeZoneService,
        private organizationService: OrganizationService,
        private aircraftTypeService: AircraftTypeService,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) {

        this.severities = UtilityService.GetKeyValues(Severity);
        this.incidentStatuses = UtilityService.GetKeyValues(IncidentStatus);
        this.affectedStations = [];

        this.datepickerOptionED = new DateTimePickerOptions();
        this.datepickerOptionFLT = new DateTimePickerOptions();

        this.datepickerOptionDeparture = new DateTimePickerOptions();
        this.datepickerOptionArrival = new DateTimePickerOptions();
        // This proxy is created for not create the GlobalStateService in constructor level and reuse the
        // GlobalStateService.
        this.globalStateProxy = injector.get(GlobalStateService);
    }

    ngOnInit(): void {
        debugger;
        this.submitted = false;
        this.EmergencyDateLocal = new Date();
        this.submittedFlight = false;
        this.flightClass = { 'is-disabled': false };
        this.isBorrowed = false;
        this.datepickerOptionED.maxDate = new Date();
        this.datepickerOptionFLT.position = 'top left';

        this.datepickerOptionDeparture.position = 'top left';
        this.datepickerOptionArrival.position = 'top left';
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.credential = UtilityService.getCredentialDetails();
        this.isFlightRelated = false;
        this.disableIsDrill = true;
        this.disableIsDrillPopup = true;
        this.IsDrillPopup = false;
        this.isOffsite = false;
        const d = new Date();
        const tomorrowDate = d.getDate() + 1000;
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

        this.form.get('EmergencyDate')
            .setValue(moment(new Date()).format('DD-MMM-YYYY HH:mm'));

        this.form.get('EmergencyDateLocal')
            .setValue(moment(new Date()).utc().format('DD-MMM-YYYY HH:mm'));

        this.form.get('ReportedDate')
            .setValue(moment(new Date()).format('DD-MMM-YYYY HH:mm'));

        this.form.get('ReportedDateLocal')
            .setValue(moment(new Date()).utc().format('DD-MMM-YYYY HH:mm'));

        this.emergencyLocationService.GetAllActiveEmergencyLocations()
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((result: ResponseModel<EmergencyLocationModel>) => {
                result.Records.forEach((item: EmergencyLocationModel) => {
                    const emergencyLocationModel: EmergencyLocationModel = new EmergencyLocationModel();
                    emergencyLocationModel.IATA = item.IATA;
                    emergencyLocationModel.AirportName = item.AirportName;
                    emergencyLocationModel.Country = item.Country;
                    emergencyLocationModel.TimeZone = item.TimeZone;
                    emergencyLocationModel.UTCOffset = item.UTCOffset;
                    this.affectedStations.push(emergencyLocationModel);
                    this.affectedStations.sort(function (a, b) { return (a.AirportName.toUpperCase() > b.AirportName.toUpperCase()) ? 1 : ((b.AirportName.toUpperCase() > a.AirportName.toUpperCase()) ? -1 : 0); });
                });
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    initiateIncidentModel(): void {
        this.incidentModel = new IncidentModel();
        this.incidentModel.IncidentStatus = UtilityService.GetKeyValues(IncidentStatus)[0].Key;
        this.incidentModel.Severity = UtilityService.GetKeyValues(Severity)[0].Key;
    }

    getAllActiveEmergencyTypes(): void {
        this.emergencyTypeService.GetAllActive()
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<EmergencyTypeModel>) => {
                this.activeEmergencyTypes = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    getAllActiveOrganizations(): void {
        this.organizationService.GetAllActiveOrganizations()
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<OrganizationModel>) => {
                const org: OrganizationModel = response.Records.find((item: OrganizationModel) => {
                    return item.OrganizationCode == 'All Organization';
                });
                const index: number = response.Records.indexOf(org);
                if (index >= -1) {
                    response.Records.splice(index, 1);
                }
                this.activeOrganizations = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    getIncidentsToPickForReplication(isFlightRelated: boolean, emergencyTypeId: string): boolean {
        if (emergencyTypeId === '') {
            this.incidentsToPickForReplication = [];
            this.isBorrowed = false;
            return false;
        }
        this.incidentService.GetLastConfiguredCountIncidents()
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<IncidentModel>) => {
                this.incidentsToPickForReplication = [];
                response.Records.sort((a, b) => {
                    if (new Date(a.CreatedOn) < new Date(b.CreatedOn)) return 1;
                    if (new Date(b.CreatedOn) < new Date(a.CreatedOn)) return -1;
                    return 0;
                });
                let internalCount: number = 0;
                this.isBorrowed = false;
                if (response.Count > 0) {
                    this.isBorrowed = true;
                }
                for (let i: number = 0; internalCount < +this.lastCount; i++) {
                    if (response.Records[i].InvolvedParties.length > 0) {
                        if (isFlightRelated) {
                            if (response.Records[i].InvolvedParties[0].InvolvedPartyType === 'Flight') {
                                this.incidentsToPickForReplication.push(response.Records[i]);
                                internalCount++;
                            }
                        }
                        else {
                            if (response.Records[i].InvolvedParties[0].InvolvedPartyType === 'NonFlight') {
                                this.incidentsToPickForReplication.push(response.Records[i]);
                                internalCount++;
                            }
                        }
                    }
                }

                this.incidentsToPickForReplication.map((item: IncidentModel) => {
                    if (item.ClosedOn != null) {
                        item.EmergencyName = item.EmergencyName + ' (closed)';
                    }
                });
                this.incidentModel.BorrowedIncident = 0;
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    getAllActiveAircraftTypes(): void {
        this.aircraftTypeService.GetAllActiveAircraftTypes()
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<AircraftTypeModel>) => {
                this.activeAircraftTypes = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
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
        this.EmergencyCountry = '';
        if (IATAVal === 'Offsite') {
            this.isOffsite = true;
            this.EmergencyCountry = '';
            this.form.controls['AffectedCountry'].reset({ value: '', disabled: false });
        }
        else {
            this.isOffsite = false;
            const list: EmergencyLocationModel[] = affectedStations
                .filter((item: EmergencyLocationModel) => item.IATA === IATAVal);
            if (list.length > 0) {
                this.EmergencyCountry = list[0].Country;
                this.form.controls['AffectedCountry'].reset({ value: this.EmergencyCountry, disabled: false });
            }
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
        if (this.isFlightRelated) {
            this.submittedFlight = false;
            if (incidentId !== '0') {
                this.ResetFlightFields();

                const incidentToPickForReplication: IncidentModel = incidentsToPickForReplication
                    .find((x: IncidentModel) => x.IncidentId === +incidentId);

                this.incidentService.GetFlightInfoFromIncident(+incidentId)
                    // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
                    .takeUntil(this.ngUnsubscribe)
                    .subscribe((itemFlight: FlightModel) => {
                        this.FillFlightFields(itemFlight);
                        jQuery('#Scheduleddeparture, #Scheduledarrival').attr('data-disable', 'true');
                        this.scheduledDepartureDateTimePicker.toggleControl();
                        this.scheduledArrivalDateTimePicker.toggleControl();
                        this.isBorrowedIncidentPopup = true;
                    }, (error: any) => {
                        console.log(`Error: ${error.message}`);
                    });
            }
            else {
                this.ResetFlightFields();
                jQuery('#Scheduleddeparture, #Scheduledarrival').removeAttr('data-disable');
                this.scheduledDepartureDateTimePicker.toggleControl();
                this.scheduledArrivalDateTimePicker.toggleControl();
            }
        }
    }

    public ResetFlightFields(): void {
        this.flightClass = { 'is-disabled': false };
        this.formFlight = new FormGroup({
            FlightNumber: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            Origin: new FormControl('', [Validators.required]),
            Destination: new FormControl('', [Validators.required]),
            Scheduleddeparture: new FormControl('', [Validators.required]),
            Scheduledarrival: new FormControl('', [Validators.required]),
            FlightTailNumber: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            AircraftTypeId: new FormControl('', [Validators.required]),
            ScheduleddepartureLOC: new FormControl(''),
            ScheduledarrivalLOC: new FormControl('')
        });
    }

    public FillFlightFields(itemFlight: FlightModel): void {
        this.flightClass = { 'is-disabled': true };
        this.ScheduleDepartureLocal = new Date(new Date(itemFlight.DepartureDate).toLocaleString() + ' UTC');
        this.ScheduleArrivalLocal = new Date(new Date(itemFlight.ArrivalDate).toLocaleString() + ' UTC');
        this.formFlight = new FormGroup({
            FlightNumber: new FormControl(itemFlight.FlightNo),
            Origin: new FormControl(itemFlight.OriginCode),
            Destination: new FormControl(itemFlight.DestinationCode),
            Scheduleddeparture: new FormControl(moment(itemFlight.DepartureDate).format('DD-MMM-YYYY HH:mm')),
            Scheduledarrival: new FormControl(moment(itemFlight.ArrivalDate).format('DD-MMM-YYYY HH:mm')),
            FlightTailNumber: new FormControl(itemFlight.FlightTaleNumber),
            AircraftTypeId: new FormControl(itemFlight.AircraftTypeId),
            ScheduleddepartureLOC: new FormControl(moment(this.ScheduleDepartureLocal).format('DD-MMM-YYYY HH:mm')),
            ScheduledarrivalLOC: new FormControl(moment(this.ScheduleArrivalLocal).format('DD-MMM-YYYY HH:mm'))
        });
    }

    public IsDrill(event: any): void {
        console.log(event.checked);
    }

    checkBoxMouseDown(event: any): void {
        event.stopPropagation();
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

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
            AffectedCountry: new FormControl('', [Validators.required]),
            OffsiteDetails: new FormControl(''),
            EmergencyName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
            WhatHappened: new FormControl('', [Validators.required]),
            WhereHappened: new FormControl(''),
            OtherConfirmationInformation: new FormControl(''),
            ReportedDate: new FormControl('', [Validators.required, this.validateDate]),
            ReportedDateLocal: new FormControl(''),
            Description: new FormControl('', [Validators.required]),
            EmergencyDate: new FormControl('', [Validators.required, this.validateEmergencyDate]),
            Severity: new FormControl(''),
            OrganizationId: new FormControl('', [Validators.required]),
            SourceInformation: new FormControl('', [Validators.maxLength(100)]),
            ReportedByName: new FormControl('', [Validators.maxLength(100)]),
            ReportedByAddress: new FormControl(''),
            ContactOfWitness: new FormControl('', [Validators.maxLength(50)]),
            SenderOfCrisisInformation: new FormControl('', [Validators.maxLength(100)]),
            BorrowedIncident: new FormControl(0),
            EmergencyDateLocal: new FormControl(''),
            IncidentsToPickForReplication: new FormControl('')
        });
    }

    private validateEmergencyDate(control: FormControl): any {
        //Check he date is valid or not
        let validDate: Date;
        try {
            validDate = new Date(Date.parse(control.value));
            if (validDate.toString() == 'Invalid Date') {
                return { InvalidEmergencyDate: true };
            } else {
                //If the date is valid then check that the date is in future date or not.
                let currentDateTime = new Date();
                if (currentDateTime < validDate) {
                    return { FutureEmergencyDate: true };
                } else {
                    return null
                }
            }
        } catch (ex) {
            return { InvalidEmergencyDate: true };
        }
    }

    private validateDate(control: FormControl): any {
        //Check he date is valid or not
        let validDate: Date;
        try {
            validDate = new Date(Date.parse(control.value));
            if (validDate.toString() == 'Invalid Date') {
                return { InvalidDate: true };
            } else {
                return null
            }
        } catch (ex) {
            return { InvalidDate: true };
        }
    }

    public onBlue_EmergencyDate($event): void {
        let emergencyDate: Date = new Date();
        if (this.form.get('EmergencyDate').valid) {
            emergencyDate = new Date(this.form.get('EmergencyDate').value);
        }
        this.emergencyDateTimePicker.setDate(emergencyDate);
    }

    public onBlue_ReportedDate($event): void {
        let reportedDate: Date = new Date();
        if (this.form.get('ReportedDate').valid) {
            reportedDate = new Date(this.form.get('ReportedDate').value);
        }
        this.reportedDateTimePicker.setDate(reportedDate);
    }

    public onBlue_ScheduledDepartureDate($event): void {
        if (this.preventOnBlurExecution) {
            this.preventOnBlurExecution = false;
            return;
        }
        let scheduledDepartureDate: Date = new Date();
        if (this.formFlight.get('Scheduleddeparture').valid) {
            scheduledDepartureDate = new Date(this.formFlight.get('Scheduleddeparture').value);
        }
        this.scheduledDepartureDateTimePicker.setDate(scheduledDepartureDate);
    }

    public onBlue_ScheduledArrivalDate($event): void {
        if (this.preventOnBlurExecution) {
            this.preventOnBlurExecution = false;
            return;
        }
        let scheduledArrivalDate: Date = new Date();
        if (this.formFlight.get('Scheduledarrival').valid) {
            scheduledArrivalDate = new Date(this.formFlight.get('Scheduledarrival').value);
        }
        this.scheduledArrivalDateTimePicker.setDate(scheduledArrivalDate);
    }

    resetFlightForm(): void {
        this.formFlight = new FormGroup({
            FlightNumber: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            Origin: new FormControl('', [Validators.required]),
            Destination: new FormControl('', [Validators.required]),
            Scheduleddeparture: new FormControl('', [Validators.required, this.validateDate]),
            Scheduledarrival: new FormControl('', [Validators.required, this.validateDate]),
            FlightTailNumber: new FormControl('', [Validators.required, Validators.maxLength(50)]),
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
            this.ResetFlightFields();
        }
    }
    onSubmit(): void {
        debugger;
        this.submitted = true;
        this.submittedFlight = true;
        if (this.form.valid && this.isFlightRelated === false) {
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
        this.createInvolvepartyAndFlight(this.isFlightRelated);
        this.fillIncidentDataExchangeModelData(this.incidentModel, this.involvePartyModel,
            this.flightModel, this.affectedModel);
        this.childModalViewIncident.show();
        this.loadDataIncidentViewPopup();
    }

    createInvolvepartyAndFlight(isFlightRelated: boolean) {
        this.createInvolvePartyModel(this.isFlightRelated);
        this.createFlightModel(isFlightRelated);
        this.createAffectedModel();
    }

    onPOPUPSubmit(values: object): void {
        console.log('Incident Created.');
        // console.log(this.incidentDataExchangeModel);
        if (this.incidentDataExchangeModel.IncidentModel.EmergencyLocation === 'Offsite') {
            this.incidentDataExchangeModel.IncidentModel.EmergencyLocation = this.incidentDataExchangeModel.IncidentModel.OffSetLocation;
            delete this.incidentDataExchangeModel.IncidentModel.OffSetLocation;
        }
        this.incidentDataExchangeModel.IncidentModel.CreatedOn = new Date();
        this.incidentDataExchangeModel.InvolvedPartyModel.CreatedOn = new Date();
        this.incidentDataExchangeModel.FLightModel.CreatedOn = new Date();

        delete this.incidentDataExchangeModel.FLightModel.OriginCode_Extended;
        delete this.incidentDataExchangeModel.FLightModel.DestinationCode_Extended;

        this.incidentDataExchangeModel.AffectedModel.CreatedOn = new Date();
        this.incidentService.CreateIncident(this.incidentDataExchangeModel.IncidentModel,
            this.incidentDataExchangeModel.IsFlightRelated,
            this.incidentDataExchangeModel.InvolvedPartyModel, this.incidentDataExchangeModel.FLightModel,
            this.incidentDataExchangeModel.AffectedModel)

            .subscribe((response: IncidentModel) => {
                UtilityService.SetToSession({ CurrentIncidentId: response.IncidentId });
                this.globalStateProxy.NotifyDataChanged('incidentCreate', response.IncidentId);
                this.router.navigate(['pages/dashboard']);
            }, (error: any) => {
                console.log(`Error ${error}`);
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
        //console.log('Going to the View page.........................');
    }

    resetIncidentViewForm(): void {
        this.formPopup = new FormGroup({
            IncidentId: new FormControl(0),
            IsDrill: new FormControl(false),
            EmergencyTypeIdPopup: new FormControl('0'),
            AffectedStationIdPopup: new FormControl(''),
            AffectedCountryPopup: new FormControl(''),
            EmergencyNamePopup: new FormControl(''),
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
        this.disableIsDrill = true;
        this.isOffSitePopup = false;
        if (this.incidentDataExchangeModel.IncidentModel.EmergencyLocation === 'Offsite') {
            this.isOffSitePopup = true;
        }
        const tt = moment(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).utc().format('DD-MMM-YYYY HH:mm');
        const _utc = moment(new Date(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).toISOString()).format('DD-MMM-YYYY HH:mm');
        this.formPopup = new FormGroup({
            IncidentId: new FormControl(this.incidentDataExchangeModel.IncidentModel.IncidentId),
            EmergencyTypeIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyTypeId),
            AffectedStationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyLocation),
            AffectedCountryPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyCountry),
            OffsiteDetailsPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OffSetLocation),
            EmergencyNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyName),
            WhatHappenedPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhatHappend),
            WhereHappenedPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhereHappend),
            OtherConfirmationInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OtherConfirmationInformation),
            // LatitudePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Latitude),
            // LongitudePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Longitude),
            ReportedDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.ReportedDate).format('DD-MMM-YYYY HH:mm')),
            ReportedDateLocalPopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.ReportedDate).utc().format('DD-MMM-YYYY HH:mm')),
            DescriptionPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Description),
            EmergencyDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).format('DD-MMM-YYYY HH:mm')),
            EmergencyDateLocalPopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).utc().format('DD-MMM-YYYY HH:mm')),
            SeverityPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Severity),
            OrganizationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OrganizationId),
            SourceInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SourceInformation),
            ReportedByNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByName),
            ReportedByAddressPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByAddress),
            ContactOfWitnessPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ContactOfWitness),
            SenderOfCrisisInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SenderOfCrisisInformation),
            BorrowedIncidentPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.BorrowedIncident === 0 ? '' : this.incidentDataExchangeModel.IncidentModel.BorrowedIncident)
        });
        this.IsDrillPopup = this.incidentDataExchangeModel.IncidentModel.IsDrill;
        this.isFlightRelatedPopup = false;

        if (this.incidentDataExchangeModel.IsFlightRelated === true) {
            this.formPopup = new FormGroup({
                IncidentId: new FormControl(this.incidentDataExchangeModel.IncidentModel.IncidentId),
                EmergencyTypeIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyTypeId),
                AffectedStationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyLocation),
                AffectedCountryPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyCountry),
                OffsiteDetailsPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OffSetLocation),
                EmergencyNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyName),
                WhatHappenedPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhatHappend),
                WhereHappenedPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhereHappend),
                OtherConfirmationInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OtherConfirmationInformation),
                // LatitudePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Latitude),
                // LongitudePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Longitude),
                ReportedDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.ReportedDate).format('DD-MMM-YYYY HH:mm')),
                ReportedDateLocalPopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.ReportedDate).utc().format('DD-MMM-YYYY HH:mm')),
                DescriptionPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Description),
                EmergencyDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).format('DD-MMM-YYYY HH:mm')),
                EmergencyDateLocalPopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).utc().format('DD-MMM-YYYY HH:mm')),
                SeverityPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Severity),
                OrganizationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OrganizationId),
                SourceInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SourceInformation),
                ReportedByNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByName),
                ReportedByAddressPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByAddress),
                ContactOfWitnessPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ContactOfWitness),
                SenderOfCrisisInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SenderOfCrisisInformation),
                BorrowedIncidentPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.BorrowedIncident),
                FlightNumberPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.FlightNo),
                OriginPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.OriginCode_Extended),
                DestinationPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.DestinationCode_Extended),
                ScheduleddeparturePopup: new FormControl(moment(this.incidentDataExchangeModel.FLightModel.DepartureDate).format('DD-MMM-YYYY HH:mm')),
                ScheduledarrivalPopup: new FormControl(moment(this.incidentDataExchangeModel.FLightModel.ArrivalDate).format('DD-MMM-YYYY HH:mm')),
                FlightTailNumberPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.FlightTaleNumber),
                AircraftTypeIdPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.AircraftTypeId),
                ScheduleddepartureLOCPopup: new FormControl(this.formFlight.get('ScheduleddepartureLOC').value),
                ScheduledarrivalLOCPopup: new FormControl(this.formFlight.get('ScheduledarrivalLOC').value)
            });
            this.IsDrillPopup = this.incidentDataExchangeModel.IncidentModel.IsDrill;
            this.isFlightRelatedPopup = true;
        }
        if (this.isBorrowedIncidentPopup) {
            const id: number = +this.formPopup.controls['BorrowedIncidentPopup'].value;
            if (id) {
                const selectedIncident: IncidentModel = this.incidentsToPickForReplication
                    .find((item: IncidentModel) => {
                        return item.IncidentId === id;
                    });

                this.formPopup.controls['BorrowedIncidentPopup'].setValue(selectedIncident.EmergencyName);
            }
        }
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
        this.involvePartyModel.CreatedBy = +this.credential.UserId;
        this.involvePartyModel.CreatedOn = this.date;
    }

    createAffectedModel(): void {
        this.affectedModel = new AffectedModel();
        this.affectedModel.AffectedId = 0;
        this.affectedModel.InvolvedPartyId = 0;
        this.affectedModel.Severity = this.form.controls['Severity'].value === '' ? null : this.form.controls['Severity'].value;
        this.affectedModel.ActiveFlag = 'Active';
        this.flightModel.CreatedBy = +this.credential.UserId;
        this.flightModel.CreatedOn = this.date;
    }

    createFlightModel(isFlightRelated: boolean): void {
        this.flightModel = new FlightModel();
        this.flightModel.FlightId = 0;
        this.flightModel.InvolvedPartyId = 0;
        this.flightModel.FlightNo = (isFlightRelated === true) ?
            this.formFlight.controls['FlightNumber'].value : 'DUMMY_FLIGHT';
        this.flightModel.OriginCode = (isFlightRelated === true) ?
            this.formFlight.controls['Origin'].value : 'DUMMY_ORG';
        if (this.flightModel.OriginCode != 'DUMMY_ORG') {
            this.flightModel.OriginCode_Extended = this.affectedStations.filter((item: EmergencyLocationModel) => {
                return item.IATA == this.flightModel.OriginCode;
            })[0].AirportName;
        }
        else {
            this.flightModel.OriginCode_Extended = this.flightModel.OriginCode;
        }
        this.flightModel.DestinationCode = (isFlightRelated === true) ?
            this.formFlight.controls['Destination'].value : 'DUMMY_DES';
        if (this.flightModel.DestinationCode != 'DUMMY_DES') {
            this.flightModel.DestinationCode_Extended = this.affectedStations.filter((item: EmergencyLocationModel) => {
                return item.IATA == this.flightModel.DestinationCode;
            })[0].AirportName;
        }
        else {
            this.flightModel.DestinationCode_Extended = this.flightModel.DestinationCode;
        }
        this.flightModel.DepartureDate = (isFlightRelated === true) ?
            new Date(this.formFlight.controls['Scheduleddeparture'].value) : new Date('01/01/2001');

        this.flightModel.DepartureDateLocal = (isFlightRelated === true) ?
            new Date(this.formFlight.controls['ScheduleddepartureLOC'].value) : new Date('01/01/2001');

        this.flightModel.ArrivalDate = (isFlightRelated === true) ?
            new Date(this.formFlight.controls['Scheduledarrival'].value) : new Date('01/02/2001');

        this.flightModel.ArrivalDateLocal = (isFlightRelated === true) ?
            new Date(this.formFlight.controls['ScheduledarrivalLOC'].value) : new Date('01/02/2001');

        this.flightModel.FlightTaleNumber = (isFlightRelated === true) ?
            this.formFlight.controls['FlightTailNumber'].value : 'DUMMY_FLT_TAIL';
        // this.flightModel.FlightTaleNumber = (isFlightRelated === true) ?
        //     ' ' : 'DUMMY_FLT_TAIL';
        this.flightModel.AircraftTypeId = (isFlightRelated === true) ?
            this.formFlight.controls['AircraftTypeId'].value : 1;
        this.flightModel.LoadAndTrimInfo = null;
        this.flightModel.ActiveFlag = 'Active';
        this.flightModel.CreatedBy = +this.credential.UserId;
        this.flightModel.CreatedOn = this.date;
    }

    createIncidentModel(): void {
        this.initiateIncidentModel();
        this.incidentModel.IsDrill = this.form.controls['IsDrill'].value;
        this.incidentModel.EmergencyTypeId = Number(this.form.controls['EmergencyTypeId'].value);
        this.incidentModel.IncidentStatus = UtilityService.GetKeyValues(IncidentStatus)[0].Key;
        this.incidentModel.EmergencyName = this.form.controls['EmergencyName'].value;
        this.incidentModel.WhatHappend = this.form.controls['WhatHappened'].value;
        this.incidentModel.WhereHappend = this.form.controls['WhereHappened'].value;
        this.incidentModel.OtherConfirmationInformation = this.form.controls['OtherConfirmationInformation'].value;
        // this.incidentModel.Latitude = this.form.controls['Latitude'].value;
        // this.incidentModel.Longitude = this.form.controls['Longitude'].value;

        this.incidentModel.ReportedDate = new Date(this.form.controls['ReportedDate'].value);

        this.incidentModel.Description = this.form.controls['Description'].value;
        this.incidentModel.EmergencyDate = new Date(this.form.controls['EmergencyDate'].value);
        this.incidentModel.Severity = this.form.controls['Severity'].value === '' ? null : this.form.controls['Severity'].value;
        if (this.form.controls['AffectedStationId'].value !== 'Offsite') {
            this.incidentModel.EmergencyLocation = this.form.controls['AffectedStationId'].value;
        }
        else {
            this.incidentModel.EmergencyLocation = this.form.controls['AffectedStationId'].value;
            this.incidentModel.OffSetLocation = this.form.controls['OffsiteDetails'].value;
        }
        this.incidentModel.EmergencyCountry = this.form.controls['AffectedCountry'].value;
        this.incidentModel.OrganizationId = +this.form.controls['OrganizationId'].value;
        this.incidentModel.SourceInformation = this.form.controls['SourceInformation'].value;
        this.incidentModel.ReportedByName = this.form.controls['ReportedByName'].value;
        this.incidentModel.ReportedByAddress = this.form.controls['ReportedByAddress'].value;
        this.incidentModel.ContactOfWitness = this.form.controls['ContactOfWitness'].value;
        this.incidentModel.SenderOfCrisisInformation = this.form.controls['SenderOfCrisisInformation'].value;
        if (+this.form.controls['BorrowedIncident'].value !== 0) {
            this.incidentModel.BorrowedIncident = +this.form.controls['BorrowedIncident'].value;
        }
        else {
            this.incidentModel.BorrowedIncident = null;
        }

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
        this.incidentModel.CreatedBy = +this.credential.UserId;
        this.incidentModel.CreatedOn = this.date;
    }

    hideIncidentView(): void {
        this.childModalViewIncident.hide();
    }

    public dateTimeSet(date: DateTimePickerSelectEventArgs, controlName: string): void {
        this.preventOnBlurExecution = true;
        let departurearrivalDate: string = this.DateFormat(date.SelectedDate as Date);
        let utc = (date.SelectedDate as Date).getTime();
        let localDepartureArrivalDate: string = '';

        if (controlName === 'EmergencyDate') {
            this.form.get('EmergencyDate')
                .setValue(moment(date.SelectedDate as Date).format('DD-MMM-YYYY HH:mm'));

            this.form.get('EmergencyDateLocal')
                .setValue(moment(date.SelectedDate as Date).utc().format('DD-MMM-YYYY HH:mm'));
        }
        else if (controlName === 'ReportedDate') {
            this.form.get('ReportedDate')
                .setValue(moment(date.SelectedDate as Date).format('DD-MMM-YYYY HH:mm'));

            this.form.get('ReportedDateLocal')
                .setValue(moment(date.SelectedDate as Date).utc().format('DD-MMM-YYYY HH:mm'));
        }

        else if (controlName === 'Scheduleddeparture') {
            this.GetLocalDateTime(date.SelectedDate as Date, true, (dt: Date) => {
                localDepartureArrivalDate = this.DateFormat(dt);
                this.formFlight.get('Scheduleddeparture').setValue(departurearrivalDate);
                this.formFlight.get('ScheduleddepartureLOC').setValue(localDepartureArrivalDate);

                if (this.scheduledArrivalDateTimePicker) {
                    this.scheduledArrivalDateTimePicker.updateConfig({
                        minDate: new Date(date.SelectedDate.toLocaleString())
                    });
                }
            });
        }

        else if (controlName === 'Scheduledarrival') {
            this.GetLocalDateTime(date.SelectedDate as Date, false, (dt: Date) => {
                localDepartureArrivalDate = this.DateFormat(dt);
                this.formFlight.get('Scheduledarrival').setValue(departurearrivalDate);
                this.formFlight.get('ScheduledarrivalLOC').setValue(localDepartureArrivalDate);
            });
        }
    }

    public GetUTCOffsetHours(isOrigin: boolean): string {
        let originOrDestinationIATA: string = '';
        let UTC_TimeZone: string = '';

        originOrDestinationIATA = (isOrigin) ?
            this.formFlight.get('Origin').value :
            this.formFlight.get('Destination').value;

        if (originOrDestinationIATA != '') {
            UTC_TimeZone = this.affectedStations.find((item: EmergencyLocationModel) =>
                item.IATA == originOrDestinationIATA
            ).TimeZone;
        } else {
            this.toastrService.error('Flight Origin or Destination should not be empty. Please select some value.', 'Error', this.toastrConfig);
        }

        return UTC_TimeZone;
    }

    private GetLocalDateTime(utc: Date, isOrigin: boolean, callback?: ((_: Date) => void)): void {
        let timeZone: string = this.GetUTCOffsetHours(isOrigin);
        if (timeZone != '') {
            let zi = new ZoneIndicator();

            zi.Year = utc.getFullYear().toString();
            zi.Month = (utc.getMonth() + 1).toString();
            zi.Day = utc.getDate().toString();
            zi.Hour = utc.getHours().toString();
            zi.Minute = utc.getMinutes().toString();
            zi.Second = utc.getSeconds().toString();
            zi.CurrentTime = new Date();
            zi.ZoneName = timeZone;
            let localDate = new Date();

            this.timeZoneService.GetLocalTime(zi)
                // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
                .subscribe((result: ZoneIndicator) => {
                    localDate = new Date(result.CurrentTime);
                    if (callback) {
                        callback(localDate);
                    }
                });
        }
    }

    private stdTimezoneOffset(dt: Date): number {
        var jan = new Date(dt.getFullYear(), 0, 1);
        var jul = new Date(dt.getFullYear(), 6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    }

    private isDst(dt: Date): boolean {
        return dt.getTimezoneOffset() < this.stdTimezoneOffset(dt);
    }

    private DateFormat(date: Date): string {
        let hours = (date.getHours());
        // let mid = (hours > 12) ? 'PM' : 'AM';
        const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const day: string = this.padChr(date.getDate(), 2, '0');
        return `${day}-${months[date.getMonth()]}-${date.getFullYear()} ${((date.getHours()) < 10) ? ("0" + (date.getHours())) : (date.getHours())}:${(date.getMinutes() < 10) ? ("0" + (date.getMinutes())) : (date.getMinutes())}`;
    }

    private padChr(value: number, size: number, char: string): string {
        let str: string = value.toString();
        while (str.length < size) {
            str = `${char}${str}`;
        }
        return str;
    }

}