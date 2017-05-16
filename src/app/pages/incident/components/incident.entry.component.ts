import { Component, ViewEncapsulation, Input, OnInit, OnDestroy, ViewChild, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import {
    FormGroup, FormControl, FormBuilder, Validators,
    ReactiveFormsModule
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
    //DataExchangeService,
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
    isOffSet: boolean = false;
    isOffSetPopup: boolean = false;
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
    severities: KeyValue[] = [];
    incidentStatuses: KeyValue[] = [];
    affectedStations: EmergencyLocationModel[] = [];
    public form: FormGroup;
    public formPopup: FormGroup;
    public EmergencyDate: Date;
    public EmergencyDateCompare: Date;
    public ArrivalDate: Date;
    public DepartureDate: Date;
    public ArrivalDateCompare: Date;
    public DepartureDateCompare: Date;
    public globalStateProxy: GlobalStateService;
    public IsDrillPopup: boolean;
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
        this.datepickerOptionED.maxDate = new Date();
        this.datepickerOptionFLT.position = 'top left';
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.isFlightRelated = false;
        this.disableIsDrill = true;
        this.disableIsDrillPopup = true;
        this.IsDrillPopup = false;
        this.isOffSet = false;
        let d = new Date();
        let tomorrowDate = d.getDate() + 1000;
        d.setDate(tomorrowDate);
        this.EmergencyDate = new Date(d);
        this.EmergencyDateCompare = new Date(d);
        this.ArrivalDate = new Date(d);
        this.DepartureDate = new Date(d);
        this.ArrivalDateCompare = new Date(d);
        this.DepartureDateCompare = new Date(d);
        this.initiateIncidentModel();
        debugger;
        this.getAllActiveEmergencyTypes();
        debugger;
        this.getAllActiveOrganizations();
        debugger;
        this.getAllActiveAircraftTypes();
        debugger;
        this.resetIncidentForm();
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
        this.emergencyTypeService.GetAll()
            .subscribe((response: ResponseModel<EmergencyTypeModel>) => {
                this.activeEmergencyTypes = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    getAllActiveOrganizations(): void {
        debugger;
        this.organizationService.GetAllActiveOrganizations()
            .subscribe((response: ResponseModel<OrganizationModel>) => {
                this.activeOrganizations = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    getAllActiveAircraftTypes(): void {
        debugger;
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

        if (emergencyType !== undefined && emergencyType.EmergencyCategory === 'FlightRelated') {
            this.isFlightRelated = true;
        }
        else {
            this.isFlightRelated = false;
        }
    }

    affectedStationChange(IATAVal: string, affectedStations: EmergencyLocationModel[]): void {
        if (IATAVal === 'Offset') {
            this.isOffSet = true;
        }
        else {
            this.isOffSet = false;
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
        this.isOffSet = false;
        this.form = new FormGroup({
            IncidentId: new FormControl(0),
            IsDrill: new FormControl(false),
            EmergencyTypeId: new FormControl('', [Validators.required]),
            AffectedStationId: new FormControl('', [Validators.required]),
            OffsiteDetails: new FormControl(''),
            EmergencyName: new FormControl('', [Validators.required]),
            AlertMessage: new FormControl('', [Validators.required]),
            Description: new FormControl('', [Validators.required]),
            EmergencyDate: new FormControl(''),
            Severity: new FormControl('', [Validators.required]),
            OrganizationId: new FormControl('', [Validators.required]),
            AirportInCharge: new FormControl('', [Validators.required]),
            CrisisReporterIdentity: new FormControl('', [Validators.required]),
            FlightNumber: new FormControl(''),
            Origin: new FormControl(''),
            Destination: new FormControl(''),
            Scheduleddeparture: new FormControl(''),
            Scheduledarrival: new FormControl(''),
            FlightTailNumber: new FormControl(''),
            AircraftTypeId: new FormControl('')
        });
    }

    onSubmit(values: object): boolean {

        if (this.form.controls['EmergencyTypeId'].value !== '0'
            && this.EmergencyDate.getTime() !== this.EmergencyDateCompare.getTime()
            && this.form.controls['AffectedStationId'].value !== '0'
            && this.form.controls['Severity'].value !== '0'
            && this.form.controls['EmergencyName'].value !== ''
            && this.form.controls['AlertMessage'].value !== ''
            && this.form.controls['Description'].value !== '') {
            this.createIncidentModel();
            if (this.isFlightRelated) {
                if (this.form.controls['FlightNumber'].value === '') {
                    this.toastrService.error('Flight Number is mandatory.', 'Initiate Emergency', this.toastrConfig);
                    console.log('Please select Flight Number');
                    return false;
                }
                if (this.form.controls['Origin'].value === '') {
                    this.toastrService.error('Origin is mandatory.', 'Initiate Emergency', this.toastrConfig);
                    console.log('Please select Origin');
                    return false;
                }
                if (this.form.controls['Destination'].value === '') {
                    this.toastrService.error('Destination is mandatory.', 'Initiate Emergency', this.toastrConfig);
                    console.log('Please select Destination');
                    return false;
                }
                if (this.DepartureDate.getTime() == this.DepartureDateCompare.getTime()) {
                    this.toastrService.error('Scheduled departure is mandatory.', 'Initiate Emergency', this.toastrConfig);
                    console.log('Please select Scheduled departure');
                    return false;
                }
                if (this.ArrivalDate.getTime() == this.ArrivalDateCompare.getTime()) {
                    this.toastrService.error('Scheduled arrival is mandatory.', 'Initiate Emergency', this.toastrConfig);
                    console.log('Please select Scheduled arrival');
                    return false;
                }
                if (this.form.controls['FlightTailNumber'].value === '') {
                    this.toastrService.error('Flight Tail Number is mandatory.', 'Initiate Emergency', this.toastrConfig);
                    console.log('Please select Flight Tail Number');
                    return false;
                }
                this.createInvolvePartyModel(this.isFlightRelated);
                this.createFlightModel();
                this.createAffectedModel();

            }

            this.fillIncidentDataExchangeModelData(this.incidentModel, this.involvePartyModel, this.flightModel, this.affectedModel);
        }
        else {
            if (this.form.controls['EmergencyTypeId'].value === '0') {
                this.toastrService.error('Emergency Type is mandatory.', 'Initiate Emergency', this.toastrConfig);
                console.log('Please select Emergency type');
                return false;
            }
            if (this.form.controls['AffectedStationId'].value === '0') {
                this.toastrService.error('Affected Station is mandatory.', 'Initiate Emergency', this.toastrConfig);
                console.log('Please select Affected Station');
                return false;
            }
            if (this.EmergencyDate.getTime() == this.EmergencyDateCompare.getTime()) {
                this.toastrService.error('Emergency Date is mandatory.', 'Initiate Emergency', this.toastrConfig);
                console.log('Please select Emergency Date');
                return false;
            }
            if (this.form.controls['Severity'].value === '0') {
                this.toastrService.error('Severity is mandatory.', 'Initiate Emergency', this.toastrConfig);
                console.log('Please select Severity');
                return false;
            }
            if (this.form.controls['EmergencyName'].value === '') {
                this.toastrService.error('Emergency Name is mandatory.', 'Initiate Emergency', this.toastrConfig);
                console.log('Please provide Emergency Name');
                return false;
            }
            if (this.form.controls['AlertMessage'].value === '') {
                this.toastrService.error('Alert Message is mandatory.', 'Initiate Emergency', this.toastrConfig);
                console.log('Please provide Alert Message');
                return false;
            }
            if (this.form.controls['Description'].value === '') {
                this.toastrService.error('Note is mandatory.', 'Initiate Emergency', this.toastrConfig);
                console.log('Please provide Note');
                return false;
            }
        }

        this.childModalViewIncident.show();
        this.loadDataIncidentViewPopup();

    }

    onPOPUPSubmit(values: object): void {
        debugger;
        console.log('Incident Created.');
        console.log(this.incidentDataExchangeModel);
        if (this.incidentDataExchangeModel.IncidentModel.EmergencyLocation === 'Offset') {
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
                //this.globalState.NotifyDataChanged('incidentCreate', response.IncidentId);
                console.log('Success');
                this.router.navigate(['pages/dashboard']);
            }, (error: any) => {
                console.log('Error');
            });
    }

    cancel(): void {
        this.resetIncidentForm();
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
            AffectedStationIdPopup: new FormControl('0'),
            OffsiteDetailsPopup: new FormControl(''),
            EmergencyNamePopup: new FormControl(''),
            AlertMessagePopup: new FormControl(''),
            DescriptionPopup: new FormControl(''),
            EmergencyDatePopup: new FormControl(''),
            SeverityPopup: new FormControl('0'),
            OrganizationIdPopup: new FormControl('0'),
            AirportInChargePopup: new FormControl(''),
            CrisisReporterIdentityPopup: new FormControl(''),
            FlightNumberPopup: new FormControl(''),
            OriginPopup: new FormControl(''),
            DestinationPopup: new FormControl(''),
            ScheduleddeparturePopup: new FormControl(''),
            ScheduledarrivalPopup: new FormControl(''),
            FlightTailNumberPopup: new FormControl('')
        });
        this.IsDrillPopup = false;
    }

    loadDataIncidentViewPopup() {
        // let offsetVal: string = '';
        this.disableIsDrill = true;
        this.isOffSetPopup = false;
        if (this.incidentDataExchangeModel.IncidentModel.EmergencyLocation === 'Offset') {
            this.isOffSetPopup = true;
        }
        this.formPopup = new FormGroup({
            IncidentId: new FormControl(this.incidentDataExchangeModel.IncidentModel.IncidentId),
            EmergencyTypeIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyTypeId),
            AffectedStationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyLocation),
            OffsiteDetailsPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OffSetLocation),
            EmergencyNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyName),
            AlertMessagePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.AlertMessage),
            DescriptionPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Description),
            EmergencyDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).format('DD/MM/YYYY h:mm a')),
            SeverityPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Severity),
            AirportInChargePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.AirportInCharge),
            OrganizationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OrganizationId),
            CrisisReporterIdentityPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.CrisisReporterIdentity)
        });
        this.IsDrillPopup = this.incidentDataExchangeModel.IncidentModel.IsDrill;
        this.isFlightRelatedPopup = false;
        if (this.incidentDataExchangeModel.FLightModel != null) {
            this.formPopup = new FormGroup({
                IncidentId: new FormControl(this.incidentDataExchangeModel.IncidentModel.IncidentId),
                EmergencyTypeIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyTypeId),
                AffectedStationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyLocation),
                OffsiteDetailsPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OffSetLocation),
                EmergencyNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyName),
                AlertMessagePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.AlertMessage),
                DescriptionPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Description),
                EmergencyDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).format('DD/MM/YYYY h:mm a')),
                SeverityPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Severity),
                AirportInChargePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.AirportInCharge),
                OrganizationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OrganizationId),
                CrisisReporterIdentityPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.CrisisReporterIdentity),
                FlightNumberPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.FlightNo),
                OriginPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.OriginCode),
                DestinationPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.DestinationCode),
                ScheduleddeparturePopup: new FormControl(moment(this.incidentDataExchangeModel.FLightModel.DepartureDate).format('DD/MM/YYYY h:mm a')),
                ScheduledarrivalPopup: new FormControl(moment(this.incidentDataExchangeModel.FLightModel.ArrivalDate).format('DD/MM/YYYY h:mm a')),
                FlightTailNumberPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.FlightTaleNumber),
                AircraftTypeIdPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.AircraftTypeId)
            });
            this.IsDrillPopup = this.incidentDataExchangeModel.IncidentModel.IsDrill;
            this.isFlightRelatedPopup = true;
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
        this.flightModel.FlightNo = this.form.controls['FlightNumber'].value;
        this.flightModel.OriginCode = this.form.controls['Origin'].value;
        this.flightModel.DestinationCode = this.form.controls['Destination'].value;
        this.flightModel.DepartureDate = this.DepartureDate;
        this.flightModel.ArrivalDate = this.ArrivalDate;
        this.flightModel.FlightTaleNumber = this.form.controls['FlightTailNumber'].value;
        this.flightModel.AircraftTypeId = this.form.controls['AircraftTypeId'].value;
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
        this.incidentModel.AlertMessage = this.form.controls['AlertMessage'].value;
        this.incidentModel.Description = this.form.controls['Description'].value;
        this.incidentModel.EmergencyDate = this.EmergencyDate;
        this.incidentModel.Severity = this.form.controls['Severity'].value;
        this.incidentModel.EmergencyLocation = this.form.controls['AffectedStationId'].value;
        this.incidentModel.AirportInCharge = this.form.controls['AirportInCharge'].value;
        this.incidentModel.OrganizationId = this.form.controls['OrganizationId'].value;
        this.incidentModel.CrisisReporterIdentity = this.form.controls['CrisisReporterIdentity'].value;

        if (this.incidentModel.EmergencyLocation === 'Offset') {
            this.incidentModel.OffSetLocation = this.form.controls['OffsiteDetails'].value;
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
        this.incidentModel.CreatedBy = 1;
        this.incidentModel.CreatedOn = this.date;
    }

    hideIncidentView(): void {
        this.childModalViewIncident.hide();
    }

    public dateTimeSet(date: DateTimePickerSelectEventArgs, controlName: string): void {
        if (controlName === 'EmergencyDate') {
            this.EmergencyDate = new Date(date.SelectedDate.toString());
        }
        else if (controlName === 'Scheduleddeparture') {
            this.DepartureDate = new Date(date.SelectedDate.toString());
        }
        else if (controlName === 'Scheduledarrival') {
            this.ArrivalDate = new Date(date.SelectedDate.toString());
        }
    }
}