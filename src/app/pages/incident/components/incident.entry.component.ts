import { Component, ViewEncapsulation, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { IncidentModel } from './incident.model';
import { EmergencyTypeModel, EmergencyTypeService } from '../../masterdata';

import {
    ResponseModel,
    DataExchangeService,
    Severity,
    KeyValue,
    KeyVal,
    IncidentStatus,
    InvolvedPartyType,
    UtilityService
} from '../../../shared';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { FlightModel, InvolvePartyModel } from '../../shared.components';
import { IncidentDataExchangeModel } from './incidentDataExchange.model';
import { } from 'angular2-air-datepicker/lib';

@Component({
    selector: 'incident-entry',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../styles/incident.style.scss'],
    templateUrl: '../views/incident.entry.html'
})
export class IncidentEntryComponent implements OnInit, OnDestroy {
    @Input() DepartmentId: any;
    @ViewChild('childModalViewIncident') public childModalViewIncident: ModalDirective;
    datePickerOption: any = {
        timepicker: true,
        format12h: true,
        fullDays: false,
        language: 'en',
        hourStep: 1,
        minuteStep: 1
    };
    //showIncidentView: boolean = null;
    isFlightRelated: boolean = false;
    isOffSet: boolean = false;
    buttonValue: String = '';
    incidentModel: IncidentModel = null;
    involvePartyModel: InvolvePartyModel = null;
    incidentDataExchangeModel: IncidentDataExchangeModel = null;
    flightModel: FlightModel = null;
    date: Date = new Date();
    activeEmergencyTypes: EmergencyTypeModel[] = [];
    severities: KeyValue[] = [];
    incidentStatuses: KeyValue[] = [];
    affectedStations: KeyVal[] = [];
    public form: FormGroup;

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
        private emergencyTypeService: EmergencyTypeService,
        private dataExchange: DataExchangeService<IncidentDataExchangeModel>,
        private dataExchangeDecision: DataExchangeService<Boolean>) {
        //this.showIncidentView = false;
        this.severities = UtilityService.GetKeyValues(Severity);
        this.incidentStatuses = UtilityService.GetKeyValues(IncidentStatus);

        this.affectedStations = [
            new KeyVal('Offset', '1'),
            new KeyVal('Airport1', '2'),
            new KeyVal('Airport2', '3'),
            new KeyVal('Airport3', '4'),
            new KeyVal('Airport4', '5'),
            new KeyVal('Airport5', '6'),
            new KeyVal('Airport6', '7'),
            new KeyVal('Airport7', '8'),
            new KeyVal('Airport8', '9'),
            new KeyVal('Airport9', '10'),
            new KeyVal('Airport10', '11'),
            new KeyVal('Airport11', '12'),
            new KeyVal('Airport12', '13'),
            new KeyVal('Airport13', '14'),
            new KeyVal('Airport14', '15')
        ]
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

    affectedStationChange(affectedStationId: string, affectedStations: KeyValue[]): void {
        let affectedStation: KeyValue = affectedStations
            .find((x: KeyValue) => x.Value === +affectedStationId);

        if (affectedStation !== undefined && affectedStation.Key === 'Offset') {
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


    ngOnInit(): any {
        this.isFlightRelated = false;
        this.isOffSet = false;
        this.initiateIncidentModel();
        this.getAllActiveEmergencyTypes();
        this.resetIncidentForm();
        this.dataExchangeDecision.Subscribe('incidentViewPreCheck', model => this.onIncidentViewPreCheck(model));
    }

    ngOnDestroy() {

    }

    onIncidentViewPreCheck(isInsertShow: Boolean): void {
        //this.showIncidentView = true;
    }

    resetIncidentForm(): void {
        this.form = new FormGroup({
            IncidentId: new FormControl(0),
            IsDrill: new FormControl(false),
            EmergencyTypeId: new FormControl('0'),
            AffectedStationId: new FormControl('0'),
            OffsiteDetails: new FormControl(''),
            EmergencyName: new FormControl(''),
            AlertMessage: new FormControl(''),
            Description: new FormControl(''),
            EmergencyDate: new FormControl(''),
            Severity: new FormControl('0'),
            //EmergencyLocation: new FormControl(''),
            //Remarks: new FormControl(''),
            FlightNumber: new FormControl(''),
            Origin: new FormControl(''),
            Destination: new FormControl(''),
            Scheduleddeparture: new FormControl(''),
            Scheduledarrival: new FormControl(''),
            FlightTailNumber: new FormControl('')
        });
    }

    onSubmit(values: Object): void {
        debugger;
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
        this.flightModel.DepartureDate = new Date();//this.form.controls['Scheduleddeparture'].value;
        this.flightModel.ArrivalDate = new Date();//this.form.controls['Scheduledarrival'].value;
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
        //this.incidentModel.ClosureNote = this.form.controls['ClosureNote'].value;
        this.incidentModel.EmergencyDate = new Date();//this.form.controls['EmergencyDate'].value;
        this.incidentModel.Severity = this.form.controls['Severity'].value;
        this.incidentModel.EmergencyLocation = this.form.controls['AffectedStationId'].value;
        this.incidentModel.IsSubmitted = true;
        this.incidentModel.IsSaved = true;
        //this.incidentModel.Remarks = this.form.controls['Remarks'].value;
        this.incidentModel.DepartmentId = Number(this.DepartmentId);
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
}