import { Component, ViewEncapsulation, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
    FormGroup, FormControl, FormBuilder, Validators,
    ReactiveFormsModule
} from '@angular/forms';
import { IncidentModel } from './incident.model';
import { EmergencyTypeModel, EmergencyTypeService } from '../../masterdata';
import { DateTimePickerSelectEventArgs } from '../../../shared/directives/datetimepicker';
import { EmergencyLocationService, EmergencyLocationModel } from "../../masterdata/emergencylocation";
import { IncidentService } from './incident.service';
import {
    ResponseModel,
    DataExchangeService,
    Severity,
    KeyValue,
    KeyVal,
    IncidentStatus,
    InvolvedPartyType,
    UtilityService,
    LocationService, Location
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
    disableIsDrill: boolean;
    isFlightRelated: boolean = false;
    isFlightRelatedPopup: boolean = false;
    isOffSet: boolean = false;
    isOffSetPopup: boolean = false;
    buttonValue: String = '';
    incidentModel: IncidentModel = null;
    involvePartyModel: InvolvePartyModel = null;
    incidentDataExchangeModel: IncidentDataExchangeModel = null;
    flightModel: FlightModel = null;
    date: Date = new Date();
    activeEmergencyTypes: EmergencyTypeModel[] = [];
    severities: KeyValue[] = [];
    incidentStatuses: KeyValue[] = [];
    affectedStations: EmergencyLocationModel[] = [];
    public form: FormGroup;
    public formPopup: FormGroup;
    public EmergencyDate: Date;
    public ArrivalDate: Date;
    public DepartureDate: Date;

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
        private emergencyLocationService: EmergencyLocationService,
        private dataExchange: DataExchangeService<IncidentDataExchangeModel>,
        private dataExchangeDecision: DataExchangeService<Boolean>,
        private locationService: LocationService) {
        this.severities = UtilityService.GetKeyValues(Severity);
        this.incidentStatuses = UtilityService.GetKeyValues(IncidentStatus);
        this.affectedStations = [];
        this.EmergencyDate = new Date();
        this.ArrivalDate = new Date();
        this.DepartureDate = new Date();
    }

    ngOnInit(): any {
        this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        this.isFlightRelated = false;
        this.disableIsDrill = false;
        this.isOffSet = false;
        this.initiateIncidentModel();
        this.getAllActiveEmergencyTypes();
        this.resetIncidentForm();
        this.resetIncidentViewForm();
        this.dataExchangeDecision.Subscribe('incidentViewPreCheck', model => this.onIncidentViewPreCheck(model));
        this.emergencyLocationService.GetAllActiveEmergencyLocations()
            .subscribe((result: ResponseModel<EmergencyLocationModel>) => {
                result.Records.forEach((item: EmergencyLocationModel) => {
                    let emergencyLocationModel: EmergencyLocationModel = new EmergencyLocationModel();
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

    emergencyTypeChange(emergencyTypeId: string, emergencyTypes: EmergencyTypeModel[]): void {
        let emergencyType: EmergencyTypeModel = emergencyTypes
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

    IsDrill(event: any): void {
        console.log(event.checked);
    }

    checkBoxMouseDown(event: any): void {
        event.stopPropagation();
    }

    ngOnDestroy() {

    }

    ShowWeatherLocation(): void {
        this.childModalViewWeatherLocation.show();
    }

    hideViewWeatherLocation(): void {
        this.childModalViewWeatherLocation.hide();
    }

    onIncidentViewPreCheck(isInsertShow: Boolean): void {

    }

    resetIncidentForm(): void {
        this.isOffSet = false;
        this.form = new FormGroup({
            IncidentId: new FormControl(0),
            IsDrill: new FormControl(false),
            EmergencyTypeId: new FormControl('', [Validators.required, Validators.minLength(1)]),
            AffectedStationId: new FormControl('', [Validators.required, Validators.minLength(1)]),
            OffsiteDetails: new FormControl(''),
            EmergencyName: new FormControl('', [Validators.required, Validators.minLength(5)]),
            AlertMessage: new FormControl('', [Validators.required, Validators.minLength(5)]),
            Description: new FormControl('', [Validators.required, Validators.minLength(10)]),
            EmergencyDate: new FormControl(''),
            Severity: new FormControl('', [Validators.required, Validators.minLength(1)]),
            FlightNumber: new FormControl(''),
            Origin: new FormControl(''),
            Destination: new FormControl(''),
            Scheduleddeparture: new FormControl(''),
            Scheduledarrival: new FormControl(''),
            FlightTailNumber: new FormControl('')
        });
    }

    onSubmit(values: Object): void {
        if (this.form.controls['EmergencyTypeId'].value !== '0' && this.form.controls['AffectedStationId'].value !== '0' && this.form.controls['Severity'].value !== '0') {

            this.createIncidentModel();
            if (this.isFlightRelated) {
                this.createInvolvePartyModel(this.isFlightRelated);
                this.createFlightModel();
            }

            this.fillIncidentDataExchangeModelData(this.incidentModel, this.involvePartyModel, this.flightModel);
        }
        else {
            if (this.form.controls['EmergencyTypeId'].value === '0') {
                console.log('Please select Emergency type');
            }
            if (this.form.controls['Severity'].value === '0') {
                console.log('Please select Severity');
            }
        }

        this.childModalViewIncident.show();
        this.loadDataIncidentViewPopup();

    }

    onPOPUPSubmit(values: Object): void {
        console.log('Incident Created.');
        console.log(this.incidentDataExchangeModel);
        if (this.incidentDataExchangeModel.IncidentModel.EmergencyLocation == 'Offset') {
            this.incidentDataExchangeModel.IncidentModel.EmergencyLocation = this.incidentDataExchangeModel.IncidentModel.OffSetLocation;
            delete this.incidentDataExchangeModel.IncidentModel.OffSetLocation;
        }
        this.incidentService.CreateIncident(this.incidentDataExchangeModel.IncidentModel,
            this.incidentDataExchangeModel.IsFlightRelated,
            this.incidentDataExchangeModel.InvolvedPartyModel, this.incidentDataExchangeModel.FLightModel)
            .subscribe((response: IncidentModel) => {
                console.log('VV');
                console.log(response);
                console.log("Success");
                this.router.navigate(['pages/dashboard']);
            }, (error: any) => {
                console.log("Error");
            });
    }


    cancel(): void {
        this.resetIncidentForm();
    }

    fillIncidentDataExchangeModelData(incidentModel: IncidentModel,
        involvedPartyModel?: InvolvePartyModel, flightModel?: FlightModel): void {
        this.incidentDataExchangeModel = new IncidentDataExchangeModel();
        this.incidentDataExchangeModel.IncidentModel = incidentModel;
        this.incidentDataExchangeModel.InvolvedPartyModel = involvedPartyModel;
        this.incidentDataExchangeModel.FLightModel = flightModel;
        this.incidentDataExchangeModel.IsFlightRelated = this.isFlightRelated;
        console.log('Going to the View page.........................');
        this.dataExchangeDecision.Publish('instructionToCloseInsertOpenViewCommand', true);
        this.dataExchange.Publish('incidentCreatedPreCheck', this.incidentDataExchangeModel);
    }

    resetIncidentViewForm(): void {
        this.formPopup = new FormGroup({
            IncidentId: new FormControl(0),
            IsDrillPopup: new FormControl(false),
            EmergencyTypeIdPopup: new FormControl('0'),
            AffectedStationIdPopup: new FormControl('0'),
            OffsiteDetailsPopup: new FormControl(''),
            EmergencyNamePopup: new FormControl(''),
            AlertMessagePopup: new FormControl(''),
            DescriptionPopup: new FormControl(''),
            EmergencyDatePopup: new FormControl(''),
            SeverityPopup: new FormControl('0'),
            FlightNumberPopup: new FormControl(''),
            OriginPopup: new FormControl(''),
            DestinationPopup: new FormControl(''),
            ScheduleddeparturePopup: new FormControl(''),
            ScheduledarrivalPopup: new FormControl(''),
            FlightTailNumberPopup: new FormControl('')
        });
    }

    loadDataIncidentViewPopup() {
        let offsetVal: string = '';
        this.disableIsDrill = true;
        this.isOffSetPopup = false;
        if (this.incidentDataExchangeModel.IncidentModel.EmergencyLocation == 'Offset') {
            this.isOffSetPopup = true;
        }
        this.formPopup = new FormGroup({
            IncidentId: new FormControl(this.incidentDataExchangeModel.IncidentModel.IncidentId),
            IsDrillPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.IsDrill),
            EmergencyTypeIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyTypeId),
            AffectedStationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyLocation),
            OffsiteDetailsPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OffSetLocation),
            EmergencyNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyName),
            AlertMessagePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.AlertMessage),
            DescriptionPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Description),
            EmergencyDatePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyDate.toLocaleString()),
            SeverityPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Severity)

        });
        this.isFlightRelatedPopup = false;
        if (this.incidentDataExchangeModel.FLightModel != null) {
            this.formPopup = new FormGroup({
                IncidentId: new FormControl(this.incidentDataExchangeModel.IncidentModel.IncidentId),
                IsDrillPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.IsDrill),
                EmergencyTypeIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyTypeId),
                AffectedStationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyLocation),
                OffsiteDetailsPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OffSetLocation),
                EmergencyNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyName),
                AlertMessagePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.AlertMessage),
                DescriptionPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Description),
                EmergencyDatePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyDate.toLocaleString()),
                SeverityPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Severity),
                FlightNumberPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.FlightNo),
                OriginPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.OriginCode),
                DestinationPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.DestinationCode),
                ScheduleddeparturePopup: new FormControl(this.incidentDataExchangeModel.FLightModel.DepartureDate.toLocaleString()),
                ScheduledarrivalPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.ArrivalDate.toLocaleString()),
                FlightTailNumberPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.FlightTaleNumber)
            });
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
        if (this.incidentModel.EmergencyLocation == 'Offset') {
            this.incidentModel.OffSetLocation = this.form.controls['OffsiteDetails'].value;
        }
        this.incidentModel.IsSubmitted = true;
        this.incidentModel.IsSaved = true;
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

    dateTimeSet(date: DateTimePickerSelectEventArgs, controlName: string): void {
        if (controlName == 'EmergencyDate') {
            this.EmergencyDate = new Date(date.SelectedDate.toString())
        }
        else if (controlName == 'Scheduleddeparture') {
            this.DepartureDate = new Date(date.SelectedDate.toString())
        }
        else if (controlName == 'Scheduledarrival') {
            this.ArrivalDate = new Date(date.SelectedDate.toString())
        }
    }

}