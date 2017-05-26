import {
    Component, ViewEncapsulation,
    OnInit, SimpleChange, OnDestroy, ViewChild
} from '@angular/core';
import * as moment from 'moment/moment';
import { TAB_LINKS } from './dashboard.tablink';
import { IncidentModel, IncidentService, IncidentDataExchangeModel } from '../incident';
import { DepartmentService } from '../masterdata/department'
import { EmergencyLocationService, EmergencyLocationModel } from "../masterdata/emergencylocation";
import {
    ITabLinkInterface,
    GlobalStateService,
    UtilityService,
    KeyValue,
    Severity,
    KeyVal,
    ResponseModel,
    IncidentStatus,
    InvolvedPartyType
} from '../../shared';
import {
    FlightModel,
    FlightService,
    InvolvePartyModel,
    InvolvePartyService,
    OrganizationModel,
    OrganizationService,
    AircraftTypeModel,
    AircraftTypeService
} from '../shared.components';
import {
    FormGroup, FormControl, FormBuilder, Validators,
    ReactiveFormsModule
} from '@angular/forms';
import { EmergencyTypeModel, EmergencyTypeService } from '../masterdata';
import { ModalDirective } from 'ng2-bootstrap/modal';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.view.html',
    styleUrls: ['./dashboard.style.scss'],
    encapsulation: ViewEncapsulation.None,

})
export class DashboardComponent implements OnInit, OnDestroy {
    @ViewChild('childModalViewIncident') public childModalViewIncident: ModalDirective;
    public incidentDate: Date;
    public tablinks: ITabLinkInterface[];
    incidentDataExchangeModel: IncidentDataExchangeModel = null;
    currentIncidentId: number;
    currentDepartmentId: number;
    currentIncident: KeyValue;
    currentDepartment: KeyValue;
    public formPopup: FormGroup;
    disableIsDrillPopup: boolean;
    currentUserId: number;
    isFlightRelatedPopup: boolean = false;
    private sub: any;
    userId: number;
    severities: KeyValue[] = [];
    isOffSetPopup: boolean = false;
    public IsDrillPopup: boolean;
    activeEmergencyTypes: EmergencyTypeModel[] = [];
    affectedStations: EmergencyLocationModel[] = [];

    activeOrganizations: OrganizationModel[] = [];
    activeAircraftTypes: AircraftTypeModel[] = [];
    incidentsToPickForReplication: IncidentModel[] = [];

    constructor(private globalState: GlobalStateService,
        private departmentService: DepartmentService,
        private involvePartyService: InvolvePartyService,
        private emergencyLocationService: EmergencyLocationService,
        private emergencyTypeService: EmergencyTypeService,
        private flightService: FlightService,
        private incidentService: IncidentService,
        private organizationService:OrganizationService,
        private aircraftTypeService:AircraftTypeService) {
        this.incidentDate = new Date();
        this.severities = UtilityService.GetKeyValues(Severity);
    }

    public ngOnInit(): void {
        this.getAllActiveEmergencyTypes();
        this.IsDrillPopup = false;
        this.disableIsDrillPopup = true;
        this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.emergencyLocationService.GetAllActiveEmergencyLocations()
            .subscribe((result: ResponseModel<EmergencyLocationModel>) => {
                result.Records.forEach((item: EmergencyLocationModel) => {
                    let emergencyLocationModel: EmergencyLocationModel = new EmergencyLocationModel();
                    emergencyLocationModel.IATA = item.IATA;
                    emergencyLocationModel.AirportName = item.AirportName;
                    this.affectedStations.push(emergencyLocationModel);
                });
            });
        this.getAllActiveOrganizations();
        this.getAllActiveAircraftTypes();
        this.getIncidentsToPickForReplication();
        this.getIncident(this.currentIncidentId);
        this.getDepartment(this.currentDepartmentId);
        this.resetIncidentViewForm();
        this.tablinks = TAB_LINKS;
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
    }

    getAllActiveOrganizations(): void {
        this.organizationService.GetAllActiveOrganizations()
            .subscribe((response: ResponseModel<OrganizationModel>) => {
                this.activeOrganizations = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
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

    getIncidentsToPickForReplication(): void {
        this.incidentService.GetLastConfiguredCountIncidents()
            .subscribe((response: ResponseModel<IncidentModel>) => {
                this.incidentsToPickForReplication = response.Records;
                this.incidentsToPickForReplication.map((item: IncidentModel) => {
                    if (item.ClosedOn != null) {
                        item.EmergencyName = item.EmergencyName + ' (closed)';
                    }
                });
            });
    }

    public getAllActiveEmergencyTypes(): void {
        this.emergencyTypeService.GetAll()
            .subscribe((response: ResponseModel<EmergencyTypeModel>) => {
                this.activeEmergencyTypes = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    public onViewIncidentClick(incidentId: number): void {
        this.incidentDataExchangeModel = new IncidentDataExchangeModel();
        this.incidentService.GetIncidentById(incidentId)
            .subscribe((incidentModel: IncidentModel) => {
                this.incidentDataExchangeModel.IncidentModel = new IncidentModel();
                this.incidentDataExchangeModel.IncidentModel = incidentModel;
                this.involvePartyService.GetByIncidentId(this.incidentDataExchangeModel.IncidentModel.IncidentId)
                    .subscribe((involveParties: ResponseModel<InvolvePartyModel>) => {
                        if (involveParties.Count > 0) {
                            this.incidentDataExchangeModel.InvolvedPartyModel = new InvolvePartyModel();
                            this.incidentDataExchangeModel.InvolvedPartyModel = involveParties.Records[0];
                            this.flightService.GetFlightByInvolvedPartyId(this.incidentDataExchangeModel.InvolvedPartyModel.InvolvedPartyId)
                                .subscribe((flights: ResponseModel<FlightModel>) => {
                                    this.incidentDataExchangeModel.FLightModel = new FlightModel();
                                    this.incidentDataExchangeModel.FLightModel = flights.Records[0];
                                    this.loadDataIncidentViewPopup();
                                })
                        }
                        else {
                            this.loadDataIncidentViewPopup();
                        }

                    });
            })

    }

    resetIncidentViewForm(): void {
        this.formPopup = new FormGroup({
            IncidentId: new FormControl(0),
            //IsDrillPopup: new FormControl(false),
            EmergencyTypeIdPopup: new FormControl('0'),
            AffectedStationIdPopup: new FormControl('0'),
            OffsiteDetailsPopup: new FormControl(''),
            EmergencyNamePopup: new FormControl(''),
            //AlertMessagePopup: new FormControl(''),
            WhatHappendPopup: new FormControl(''),
            WhereHappendPopup: new FormControl(''),
            OtherConfirmationInformationPopup: new FormControl(''),

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

            FlightNumberPopup: new FormControl(''),
            OriginPopup: new FormControl(''),
            DestinationPopup: new FormControl(''),
            ScheduleddeparturePopup: new FormControl(''),
            ScheduledarrivalPopup: new FormControl(''),
            FlightTailNumberPopup: new FormControl(''),
            AircraftTypeIdPopup: new FormControl('')
        });
        this.IsDrillPopup = false;
    }

    public loadDataIncidentViewPopup(): void {
        let offsetVal: string = '';
        this.disableIsDrillPopup = true;
        this.isOffSetPopup = false;
        if (this.incidentDataExchangeModel.IncidentModel.EmergencyLocation == 'Offset') {
            this.isOffSetPopup = true;
        }
        this.formPopup = new FormGroup({
            IncidentId: new FormControl(this.incidentDataExchangeModel.IncidentModel.IncidentId),
            //IsDrillPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.IsDrill),
            EmergencyTypeIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyTypeId),
            AffectedStationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyLocation),
            OffsiteDetailsPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OffSetLocation),
            EmergencyNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyName),
            //AlertMessagePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.AlertMessage),

            WhatHappendPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhatHappend),
            WhereHappendPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhereHappend),
            OtherConfirmationInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OtherConfirmationInformation),


            DescriptionPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Description),
            EmergencyDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).format('DD-MM-YYYY h:mm a')),
            SeverityPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Severity),

            OrganizationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OrganizationId),
            //CrisisReporterIdentityPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.CrisisReporterIdentity),

            SourceInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SourceInformation),
            ReportedByNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByName),
            ReportedByAddressPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByAddress),
            ContactOfWitnessPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ContactOfWitness),
            SenderOfCrisisInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SenderOfCrisisInformation),

        });
        this.IsDrillPopup = this.incidentDataExchangeModel.IncidentModel.IsDrill;

        this.isFlightRelatedPopup = false;
        if (this.incidentDataExchangeModel.FLightModel != undefined) {
            this.formPopup = new FormGroup({
                IncidentId: new FormControl(this.incidentDataExchangeModel.IncidentModel.IncidentId),
                //IsDrillPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.IsDrill),
                EmergencyTypeIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyTypeId),
                AffectedStationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyLocation),
                OffsiteDetailsPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OffSetLocation),
                EmergencyNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyName),
                //AlertMessagePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.AlertMessage),

                WhatHappendPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhatHappend),
                WhereHappendPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhereHappend),
                OtherConfirmationInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OtherConfirmationInformation),


                DescriptionPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Description),
                EmergencyDatePopup: new FormControl(moment(this.incidentDataExchangeModel.IncidentModel.EmergencyDate).format('DD-MM-YYYY h:mm a')),
                SeverityPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.Severity),

                OrganizationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OrganizationId),


                SourceInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SourceInformation),
                ReportedByNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByName),
                ReportedByAddressPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ReportedByAddress),
                ContactOfWitnessPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.ContactOfWitness),
                SenderOfCrisisInformationPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.SenderOfCrisisInformation),




                FlightNumberPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.FlightNo),
                OriginPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.OriginCode),
                DestinationPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.DestinationCode),
                ScheduleddeparturePopup: new FormControl(moment(this.incidentDataExchangeModel.FLightModel.DepartureDate).format('DD-MM-YYYY h:mm a')),
                ScheduledarrivalPopup: new FormControl(moment(this.incidentDataExchangeModel.FLightModel.ArrivalDate).format('DD-MM-YYYY h:mm a')),
                FlightTailNumberPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.FlightTaleNumber),
                AircraftTypeIdPopup: new FormControl(this.incidentDataExchangeModel.FLightModel.AircraftTypeId)
            });
            this.IsDrillPopup = this.incidentDataExchangeModel.IncidentModel.IsDrill;
            this.isFlightRelatedPopup = true;
        }
        this.childModalViewIncident.show();
    }

    public hideIncidentView(): void {
        this.childModalViewIncident.hide();
    }

    public ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }

    private getIncident(incidentId: number): void {
        this.incidentService.Get(incidentId)
            .subscribe((data) => {
                this.currentIncident = new KeyValue(data.Description, data.IncidentId);
                this.incidentDate = new Date(data.EmergencyDate);
            });
    }

    private getDepartment(departmentId: number): void {
        this.departmentService.Get(departmentId)
            .subscribe((data) => {
                this.currentDepartment = new KeyValue(data.Description, data.DepartmentId);

            });
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncident = incident;
        this.currentIncidentId = incident.Value;
        this.getIncident(incident.Value);
        this.globalState.NotifyDataChanged('incidentChangefromDashboard', incident);
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartment = department;
        this.currentDepartmentId = department.Value;
        this.globalState.NotifyDataChanged('departmentChangeFromDashboard', department);
    }
}