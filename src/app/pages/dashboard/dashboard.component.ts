import {
    Component, ViewEncapsulation, ElementRef,
    OnInit, SimpleChange, OnDestroy, ViewChild
} from '@angular/core';
import * as moment from 'moment/moment';
import {
    IncidentModel, IncidentService,
    IncidentDataExchangeModel
} from '../incident';
import { DepartmentService } from '../masterdata/department';
import {
    EmergencyLocationService,
    EmergencyLocationModel
} from '../masterdata/emergencylocation';
import {
    ITabLinkInterface,
    GlobalStateService,
    UtilityService,
    KeyValue,
    Severity,
    KeyVal,
    ResponseModel,
    IncidentStatus,
    InvolvedPartyType,
    GlobalConstants
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
import { EmergencyTypeModel, EmergencyTypeService, PagesPermissionMatrixModel } from '../masterdata';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.view.html',
    styleUrls: ['./dashboard.style.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit, OnDestroy {
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
    userId: number;
    severities: KeyValue[] = [];
    isOffSetPopup: boolean = false;
    public IsDrillPopup: boolean;
    activeEmergencyTypes: EmergencyTypeModel[] = [];
    affectedStations: EmergencyLocationModel[] = [];
    activeOrganizations: OrganizationModel[] = [];
    activeAircraftTypes: AircraftTypeModel[] = [];
    incidentsToPickForReplication: IncidentModel[] = [];
    showQuicklink: boolean = false;
    private sub: any;
    public isShowViewReadonlyCrisis: boolean = false;
    public accessibilityErrorMessage: string = GlobalConstants.accessibilityErrorMessage;


    constructor(private globalState: GlobalStateService,
        private departmentService: DepartmentService,
        private elementRef: ElementRef,
        private involvePartyService: InvolvePartyService,
        private emergencyLocationService: EmergencyLocationService,
        private emergencyTypeService: EmergencyTypeService,
        private flightService: FlightService,
        private incidentService: IncidentService,
        private organizationService: OrganizationService,
        private aircraftTypeService: AircraftTypeService,
        private router: Router) {
        this.incidentDate = new Date();
        this.severities = UtilityService.GetKeyValues(Severity);
    }

    public ngOnInit(): void {
        this.getAllActiveEmergencyTypes();
        this.IsDrillPopup = false;
        this.disableIsDrillPopup = true;
        this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');


        this.isShowViewReadonlyCrisis = UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'ViewReadonlyCrisis');


        this.emergencyLocationService.GetAllActiveEmergencyLocations()
            .subscribe((result: ResponseModel<EmergencyLocationModel>) => {
                result.Records.forEach((item: EmergencyLocationModel) => {
                    const emergencyLocationModel: EmergencyLocationModel = new EmergencyLocationModel();
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
        this.getPagePermission();

        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
    }

    getPagePermission(): void {
        const rootTab: PagesPermissionMatrixModel = GlobalConstants.PagePermissionMatrix
            .find((x: PagesPermissionMatrixModel) => {
                return x.ModuleName === 'Dashboard' &&
                    x.ParentPageId === null && x.Type === 'Tab' &&
                    x.DepartmentId === this.currentDepartmentId;
            });

        if (rootTab) {
             const $self: JQuery = jQuery(this.elementRef.nativeElement);
            $self.find('.error').hide();
            $self.find('.tab-root-container').show();
            const accessibleTabs: string[] = GlobalConstants.PagePermissionMatrix
                .filter((x: PagesPermissionMatrixModel) => {
                    return x.ParentPageId === rootTab.PageId &&
                        x.DepartmentId === this.currentDepartmentId;
                })
                .map((x) => x.PageCode);
            if (accessibleTabs.length > 0) {
                this.tablinks = GlobalConstants.DashboardTabLinks.filter((x: ITabLinkInterface) => accessibleTabs.some((y) => y === x.id));
                UtilityService.SelectFirstTab(this.tablinks, this.router);

            }
        }
        else {
            this.tablinks = [];
            const $self: JQuery = jQuery(this.elementRef.nativeElement);
            $self.find('.error').show();
            $self.find('.tab-root-container').hide();
        }
        // this.tablinks = TAB_LINKS;
    }

    public ngAfterContentInit(): void {
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

    public ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }



    private getIncident(incidentId: number): void {
        this.incidentService.Get(incidentId)
            .subscribe((data: IncidentModel) => {
                this.currentIncident = new KeyValue(data.EmergencyName, data.IncidentId);
                this.incidentDate = new Date(data.CreatedOn);
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
        this.getPagePermission();
        this.isShowViewReadonlyCrisis = UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'ViewReadonlyCrisis');

        this.globalState.NotifyDataChanged('departmentChangeFromDashboard', department);
    }
}