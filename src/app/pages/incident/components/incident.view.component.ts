import { Component, ViewEncapsulation, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
    FormGroup, FormControl
} from '@angular/forms';
import * as moment from 'moment/moment';
import { IncidentModel } from './incident.model';
import { EmergencyTypeModel, EmergencyTypeService } from '../../masterdata';
import { EmergencyLocationService, EmergencyLocationModel } from '../../masterdata/emergencylocation';

import {
    ResponseModel,
    GlobalStateService,
    Severity,
    KeyValue,
    IncidentStatus,
    UtilityService,
    DateTimePickerOptions,
    GlobalConstants
} from '../../../shared';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FlightModel, InvolvePartyModel } from '../../shared.components';
import { IncidentDataExchangeModel } from './incidentDataExchange.model';
import { Subject, Observable } from 'rxjs';


@Component({
    selector: 'incident-view',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/incident.view.html'
})
export class IncidentViewComponent implements OnInit, OnDestroy {
    @Input() IncidentId: number;
    @ViewChild('childModalViewIncident') public childModalViewIncident: ModalDirective;

    currentDepartmentId: number;
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
    public globalStateProxy: GlobalStateService;
    public IsDrillPopup: boolean;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private emergencyLocationService: EmergencyLocationService,
        private emergencyTypeService: EmergencyTypeService) {

        this.severities = UtilityService.GetKeyValues(Severity);
        this.incidentStatuses = UtilityService.GetKeyValues(IncidentStatus);
        this.affectedStations = [];
        this.EmergencyDate = new Date();
        this.ArrivalDate = new Date();
        this.DepartureDate = new Date();
        this.datepickerOptionED = new DateTimePickerOptions();
        this.datepickerOptionFLT = new DateTimePickerOptions();
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
        this.getAllActiveEmergencyTypes();
        this.resetIncidentViewForm();

        this.emergencyLocationService.GetAllActiveEmergencyLocations()
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((result: ResponseModel<EmergencyLocationModel>) => {
                result.Records.forEach((item: EmergencyLocationModel) => {
                    const emergencyLocationModel: EmergencyLocationModel = new EmergencyLocationModel();
                    emergencyLocationModel.IATA = item.IATA;
                    emergencyLocationModel.AirportName = item.AirportName;
                    this.affectedStations.push(emergencyLocationModel);
                });
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    loadDataIncidentViewPopup() {
        
        const offsetVal: string = '';
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
            DescriptionPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Description),
            EmergencyDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).format('DD-MM-YYYY HH:mm')),
            SeverityPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Severity)
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
                DescriptionPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Description),
                EmergencyDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).format('DD-MM-YYYY HH:mm')),
                SeverityPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Severity),
                FlightNumberPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.FlightNo),
                OriginPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.OriginCode),
                DestinationPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.DestinationCode),
                ScheduleddeparturePopup: new FormControl(moment(this.incidentDataExchangeModel.FLightModel.DepartureDate).format('DD-MM-YYYY HH:mm')),
                ScheduledarrivalPopup: new FormControl(moment(this.incidentDataExchangeModel.FLightModel.ArrivalDate).format('DD-MM-YYYY HH:mm')),
                FlightTailNumberPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.FlightTaleNumber)
            });
            this.IsDrillPopup = this.incidentDataExchangeModel.IncidentModel.IsDrill;
            this.isFlightRelatedPopup = true;
        }
    }
    
    hideIncidentView(): void {
        
        this.childModalViewIncident.hide();
    }

    getAllActiveEmergencyTypes(): void {
        this.emergencyTypeService.GetAll()
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<EmergencyTypeModel>) => {
                this.activeEmergencyTypes = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
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
            FlightNumberPopup: new FormControl(''),
            OriginPopup: new FormControl(''),
            DestinationPopup: new FormControl(''),
            ScheduleddeparturePopup: new FormControl(''),
            ScheduledarrivalPopup: new FormControl(''),
            FlightTailNumberPopup: new FormControl('')
        });
        this.IsDrillPopup = false;
    }
}