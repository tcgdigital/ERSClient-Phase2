import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, AbstractControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { IncidentModel } from './incident.model';
import { EmergencyTypeModel } from '../../emergencyType/components/emergencyType.model';
import { EmergencyTypeService } from '../../emergencyType/components/emergencyType.service';
import { IncidentService } from './incident.service';
import { 
    ResponseModel, 
    DataExchangeService, 
    Severity, 
    KeyValue, 
    IncidentStatus, 
    InvolvedPartyType 
} from '../../../../shared';
import { UtilityService } from '../../../../shared/services';
import { InvolvedPartyModel } from '../../involvedParty/components/involvedParty.model';
import { FlightModel } from '../../flight/components/flight.model';
import { IncidentDataExchangeModel } from './incidentDataExchange.model';

@Component({

    selector: 'incident-view',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/incident.view.html'
})
export class IncidentViewComponent implements OnInit {
    showView: boolean = null;
    disable: boolean = null;
    public form: FormGroup;
    severities: KeyValue[] = [];
    date: Date = new Date();
    isFlightRelated: boolean = false;
    incidentModel: IncidentModel = null;
    activeEmergencyTypes: EmergencyTypeModel[] = [];
    incidentDataExchangeModel: IncidentDataExchangeModel = null;
    constructor(formBuilder: FormBuilder,
        private incidentService: IncidentService,
        private emergencyTypeService: EmergencyTypeService,
        private dataExchange: DataExchangeService<IncidentDataExchangeModel>,
        private dataExchangeDecision: DataExchangeService<Boolean>) {
        this.showView = false;
        this.isFlightRelated = false;
        this.severities = UtilityService.GetKeyValues(Severity);
        this.incidentDataExchangeModel = new IncidentDataExchangeModel();
    }
    ngOnInit(): any {
        console.log('Hello ');
        this.getAllActiveEmergencyTypes();
        this.initiateIncidentModel();
        this.form = new FormGroup({
            IncidentId: new FormControl(0),
            IsDrill: new FormControl(true),//IsDrill: new FormControl(incidentDataExchangeModel.IncidentModel.IsDrill),
            EmergencyTypeId: new FormControl(1),//EmergencyTypeId: new FormControl(incidentDataExchangeModel.IncidentModel.EmergencyTypeId),
            EmergencyName: new FormControl(''),//EmergencyName: new FormControl(incidentDataExchangeModel.IncidentModel.EmergencyName),
            AlertMessage: new FormControl(''),//AlertMessage: new FormControl(incidentDataExchangeModel.IncidentModel.AlertMessage),
            Description: new FormControl(''),//Description: new FormControl(incidentDataExchangeModel.IncidentModel.Description),
            ClosureNote: new FormControl(''),//ClosureNote: new FormControl(incidentDataExchangeModel.IncidentModel.ClosureNote),
            EmergencyDate: new FormControl(''),//EmergencyDate: new FormControl(incidentDataExchangeModel.IncidentModel.EmergencyDate),
            Severity: new FormControl(''),//Severity: new FormControl(incidentDataExchangeModel.IncidentModel.Severity),
            EmergencyLocation: new FormControl(''),//EmergencyLocation: new FormControl(incidentDataExchangeModel.IncidentModel.EmergencyLocation),
            Remarks: new FormControl(''),//Remarks: new FormControl(incidentDataExchangeModel.IncidentModel.Remarks),

            FlightNumber: new FormControl(''),//FlightNumber: new FormControl(incidentDataExchangeModel.FLightModel.FlightNo),
            Origin: new FormControl(''),//Origin: new FormControl(incidentDataExchangeModel.FLightModel.OriginCode),
            Destination: new FormControl(''),//Destination: new FormControl(incidentDataExchangeModel.FLightModel.DestinationCode),
            Scheduleddeparture: new FormControl(''),//Scheduleddeparture: new FormControl(incidentDataExchangeModel.FLightModel.DepartureDate),
            Scheduledarrival: new FormControl(''),//Scheduledarrival: new FormControl(incidentDataExchangeModel.FLightModel.ArrivalDate),
            FlightTailNumber: new FormControl('')//FlightTailNumber: new FormControl(incidentDataExchangeModel.FLightModel.FlightTaleNumber)
        });
        this.disable = true;
        this.dataExchange.Subscribe("incidentCreatedPreCheck", model => this.onIncidentCreatedPreCheck(model));

    }
    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("incidentCreatedPreCheck");
    }
    initiateIncidentModel(): void {
        this.incidentModel = new IncidentModel();
        this.incidentModel.IncidentId = 0;
        this.incidentModel.IsDrill = false;
        this.incidentModel.EmergencyTypeId = 0;
        this.incidentModel.IncidentStatus = UtilityService.GetKeyValues(IncidentStatus)[0].Key;
        this.incidentModel.EmergencyName = '';
        this.incidentModel.AlertMessage = '';
        this.incidentModel.Description = '';
        this.incidentModel.ClosureNote = '';
        this.incidentModel.EmergencyDate = this.date;
        this.incidentModel.Severity = UtilityService.GetKeyValues(Severity)[0].Key;
        this.incidentModel.EmergencyLocation = '';
        this.incidentModel.IsSubmitted = false;
        this.incidentModel.IsSaved = false;
        this.incidentModel.Remarks = '';
        this.incidentModel.DepartmentId = 0;

        this.incidentModel.ActiveFlag = 'Active';
        this.incidentModel.CreatedBy = 1;
        this.incidentModel.CreatedOn = this.date;
    }
    getAllActiveEmergencyTypes(): void {
        this.emergencyTypeService.GetAll()
            .subscribe((response: ResponseModel<EmergencyTypeModel>) => {
                console.log(response);
                for (var x of response.Records) {
                    if (x.ActiveFlag == 'Active') {
                        x.Active = true;
                    }
                    else {
                        x.Active = false;
                    }
                }
                this.activeEmergencyTypes = response.Records;
                //this.activeEmergencyTypes.unshift(data);
                console.log(this.activeEmergencyTypes);

            });
    }
    onIncidentCreatedPreCheck(incidentDataExchangeModel: IncidentDataExchangeModel): void {
        console.log('Incident create..');
        console.log(incidentDataExchangeModel);
        console.log('Command has been given and we are now closing the insert region and opening the view region.');
        this.showView = true;
        this.incidentDataExchangeModel = incidentDataExchangeModel;
        this.incidentModel = incidentDataExchangeModel.IncidentModel;
        this.form = new FormGroup({
            IncidentId: new FormControl(0),
            IsDrill: new FormControl(incidentDataExchangeModel.IncidentModel.IsDrill),
            EmergencyTypeId: new FormControl(incidentDataExchangeModel.IncidentModel.EmergencyTypeId),
            EmergencyName: new FormControl(incidentDataExchangeModel.IncidentModel.EmergencyName),
            AlertMessage: new FormControl(incidentDataExchangeModel.IncidentModel.AlertMessage),
            Description: new FormControl(incidentDataExchangeModel.IncidentModel.Description),
            ClosureNote: new FormControl(incidentDataExchangeModel.IncidentModel.ClosureNote),
            EmergencyDate: new FormControl(incidentDataExchangeModel.IncidentModel.EmergencyDate),
            Severity: new FormControl(incidentDataExchangeModel.IncidentModel.Severity),
            EmergencyLocation: new FormControl(incidentDataExchangeModel.IncidentModel.EmergencyLocation),
            Remarks: new FormControl(incidentDataExchangeModel.IncidentModel.Remarks),

            FlightNumber: new FormControl(incidentDataExchangeModel.FLightModel.FlightNo),
            Origin: new FormControl(incidentDataExchangeModel.FLightModel.OriginCode),
            Destination: new FormControl(incidentDataExchangeModel.FLightModel.DestinationCode),
            Scheduleddeparture: new FormControl(incidentDataExchangeModel.FLightModel.DepartureDate),
            Scheduledarrival: new FormControl(incidentDataExchangeModel.FLightModel.ArrivalDate),
            FlightTailNumber: new FormControl(incidentDataExchangeModel.FLightModel.FlightTaleNumber)
        });
        this.isFlightRelated = false;
        if (incidentDataExchangeModel.IsFlightRelated) {
            this.isFlightRelated = true;
        }


    }

    onSubmit(values: Object): void {
        console.log(this.incidentDataExchangeModel);
        this.incidentService.CreateIncident(this.incidentDataExchangeModel.IncidentModel,
            this.incidentDataExchangeModel.IsFlightRelated,
            this.incidentDataExchangeModel.InvolvedPartyModel, this.incidentDataExchangeModel.FLightModel)
            .subscribe((response: IncidentModel) => {
                console.log('VV');
                console.log(response);
                //this.dataExchange.Publish("checkListModelSaved", response);
                //this.resetCheckListForm();
                //this.initiateCheckListModel();
                console.log("Success");
            }, (error: any) => {
                console.log("Error");
            });

    }
    cancel(): void {
        this.showView = false;
        this.dataExchangeDecision.Publish("incidentViewPreCheck", true);

    }
}