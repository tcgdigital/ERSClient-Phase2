import {
    Component, ViewEncapsulation,
    OnInit, SimpleChange, OnDestroy, ViewChild
} from '@angular/core';
import * as moment from 'moment/moment';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { EmergencyTypeModel, EmergencyTypeService } from '../masterdata';
import { EmergencyLocationService, EmergencyLocationModel } from '../masterdata/emergencylocation';
import { IncidentModel, IncidentService, IncidentDataExchangeModel } from '../incident';
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
import { ModalDirective } from 'ng2-bootstrap/modal';
import { Router } from '@angular/router';
import {
    ITabLinkInterface, GlobalStateService, UtilityService, KeyValue, ResponseModel, Severity,
    KeyVal,
    IncidentStatus,
    InvolvedPartyType,
    DataExchangeService,
    LocationService,
    Location,
    DateTimePickerOptions
} from '../../shared';
import { ArchiveListService } from './archive.dashboard.list.service';

@Component({
    selector: 'archive-dashboard-list',
    styleUrls: ['./archive.dashboard.list.style.scss'],
    templateUrl: './archive.dashboard.list.view.html',
    encapsulation: ViewEncapsulation.None,
})
export class ArchiveDashboardListComponent implements OnInit, OnDestroy {
    @ViewChild('childModalViewClosedIncident') public childModalViewClosedIncident: ModalDirective;

    public closedCrisises: IncidentModel[];
    activeEmergencyTypes: EmergencyTypeModel[] = [];
    affectedStations: EmergencyLocationModel[] = [];
    public formPopup: FormGroup;
    disableIsDrillPopup: boolean;
    severities: KeyValue[] = [];
    isOffSetPopup: boolean = false;
    incidentModel: IncidentModel = null;
    isFlightRelated: boolean = false;
    isFlightRelatedPopup: boolean = false;
    incidentDataExchangeModel: IncidentDataExchangeModel = null;
    currentIncidentId: number;
    public IsDrillPopup: boolean;
    activeOrganizations: OrganizationModel[] = [];
    activeAircraftTypes: AircraftTypeModel[] = [];
    incidentsToPickForReplication: IncidentModel[] = [];

    constructor(formBuilder: FormBuilder,
        private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private archiveListService: ArchiveListService,
        private emergencyTypeService: EmergencyTypeService,
        private dataExchange: DataExchangeService<IncidentDataExchangeModel>,
        private emergencyLocationService: EmergencyLocationService,
        private incidentService: IncidentService,
        private involvePartyService: InvolvePartyService,
        private flightService: FlightService,
        private globalState: GlobalStateService,
        private organizationService: OrganizationService,
        private aircraftTypeService: AircraftTypeService,
        private router: Router) {
        this.closedCrisises = [];
        this.affectedStations = [];
        this.severities = UtilityService.GetKeyValues(Severity);
    }

    public ngOnInit(): void {
        this.getAllActiveEmergencyTypes();
        this.getAllActiveOrganizations();
        this.getAllActiveAircraftTypes();
        this.getIncidentsToPickForReplication();
        this.initiateIncidentModel();
        this.isFlightRelated = false;
        this.disableIsDrillPopup = true;
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.isOffSetPopup = false;
        this.resetIncidentViewForm();
        this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');

        this.emergencyLocationService.GetAllActiveEmergencyLocations()
            .subscribe((result: ResponseModel<EmergencyLocationModel>) => {
                result.Records.forEach((item: EmergencyLocationModel) => {
                    const emergencyLocationModel: EmergencyLocationModel = new EmergencyLocationModel();
                    emergencyLocationModel.IATA = item.IATA;
                    emergencyLocationModel.AirportName = item.AirportName;
                    this.affectedStations.push(emergencyLocationModel);
                });
            });

        this.archiveListService.GetAllClosedIncidents()
            .subscribe((closedIncident: ResponseModel<IncidentModel>) => {
                closedIncident.Records.forEach((itemIncident: IncidentModel) => {
                    if (itemIncident.ReOpenBy != null && itemIncident.ReOpenOn != null
                        && itemIncident.ReClosedBy == null && itemIncident.ReClosedOn == null) {
                        itemIncident.isReopen = true;
                    }
                    else {
                        itemIncident.isReopen = false;
                    }
                    this.closedCrisises.push(itemIncident);
                });
            });
    }

    public IsReopenCheckedChange(event: any, closedCrisis: IncidentModel): void {
        closedCrisis.isReopen = event.checked;
    }

    public resetIncidentViewForm(): void {
        this.formPopup = new FormGroup({
            IncidentId: new FormControl(0),
            //IsDrillPopup: new FormControl(false),
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

    public initiateIncidentModel(): void {
        this.incidentModel = new IncidentModel();
        this.incidentModel.IncidentStatus = UtilityService.GetKeyValues(IncidentStatus)[0].Key;
        this.incidentModel.Severity = UtilityService.GetKeyValues(Severity)[0].Key;
    }

    public getAllActiveEmergencyTypes(): void {
        this.emergencyTypeService.GetAll()
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

    public loadDataIncidentViewPopup(): void {
        const offsetVal: string = '';
        this.disableIsDrillPopup = true;
        this.isOffSetPopup = false;
        if (this.incidentDataExchangeModel.IncidentModel.EmergencyLocation === 'Offset') {
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
            WhatHappenedPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhatHappend),
            WhereHappenedPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhereHappend),
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


        });
        this.IsDrillPopup = this.incidentDataExchangeModel.IncidentModel.IsDrill;
        this.isFlightRelatedPopup = false;
        if (this.incidentDataExchangeModel.FLightModel != null) {
            this.formPopup = new FormGroup({
                IncidentId: new FormControl(this.incidentDataExchangeModel.IncidentModel.IncidentId),
                //IsDrillPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.IsDrill),
                EmergencyTypeIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyTypeId),
                AffectedStationIdPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyLocation),
                OffsiteDetailsPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.OffSetLocation),
                EmergencyNamePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.EmergencyName),
                //AlertMessagePopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.AlertMessage),

                WhatHappenedPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhatHappend),
                WhereHappenedPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.WhereHappend),
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
                BorrowedIncidentPopup: new FormControl(this.incidentDataExchangeModel.IncidentModel.BorrowedIncident),



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
        this.childModalViewClosedIncident.show();
    }

    public hideClosedIncidentView(): void {
        this.childModalViewClosedIncident.hide();
    }

    public ngOnDestroy(): void { }

    public viewClosedCrisis(incidentId: number): void {
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

    public onSubmitClosedCrisis(closedCrisisList: IncidentModel[]): void {
        // We collect all closed crisis
        const objectLiteralAll: string = JSON.stringify(closedCrisisList);
        const deepCopyIncidentAll: IncidentModel[] = JSON.parse(objectLiteralAll);
        // Make them as isReopen false.
        const totalReopendCrisisAll: IncidentModel[] = deepCopyIncidentAll.map((item: IncidentModel) => {
            item.ReOpenBy = null;
            item.ReOpenOn = null;
            item.EmergencyType = null;
            item.ReClosedBy = null;
            item.ReClosedOn = null;
            item.isReopen = false;
            return item;
        });
        // Send this to database for clear everything.
        this.archiveListService.CreateBulkInsertClosedIncident(totalReopendCrisisAll)
            .subscribe((result: IncidentModel[]) => {
                // Search for the reopened crisis.
                const reopenedCrisis = closedCrisisList.filter((item: IncidentModel) => {
                    return item.isReopen === true;
                });
                // Assign the Reopened Dates and Reopened by.
                if (reopenedCrisis.length > 0) {
                    const objectLiteral: string = JSON.stringify(reopenedCrisis);
                    const deepCopyIncident: IncidentModel[] = JSON.parse(objectLiteral);
                    const totalReopendCrisis: IncidentModel[] = deepCopyIncident.map((item: IncidentModel) => {
                        item.ReOpenBy = +UtilityService.GetFromSession('CurrentUserId');
                        item.ReOpenOn = new Date();
                        item.EmergencyType = null;
                        item.ReClosedBy = null;
                        item.ReClosedOn = null;
                        return item;
                    });
                    // Again call to the database for update the reopened one.
                    this.archiveListService.CreateBulkInsertClosedIncident(totalReopendCrisis)
                        .subscribe((result: IncidentModel[]) => {
                            this.toastrService.success('Incident status updated successfully.', 'Archieve Crisis', this.toastrConfig);
                        });
                }
            }, (error) => {
                this.toastrService.error('Some Error Occured.', 'Archieve Crisis', this.toastrConfig);
            });
    }

    private onArchivedIncidentClick(incidentId: number): void {
        UtilityService.SetToSession({ ArchieveIncidentId: incidentId });
        this.router.navigate(['pages/archivedashboard']);
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
    }
}
