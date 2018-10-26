import {
    Component, ViewEncapsulation, ElementRef,
    OnInit, OnDestroy, AfterViewInit
} from '@angular/core';
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
    ResponseModel,
    GlobalConstants
} from '../../shared';
import {
    FlightService,
    InvolvePartyService,
    OrganizationModel,
    OrganizationService,
    AircraftTypeModel,
    AircraftTypeService
} from '../shared.components';
import { FormGroup } from '@angular/forms';
import { EmergencyTypeModel, EmergencyTypeService, PagesPermissionMatrixModel } from '../masterdata';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.view.html',
    styleUrls: ['./dashboard.style.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
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
    public isArchive: boolean = false;
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
    public closedDate: Date = new Date();
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private globalState: GlobalStateService,
        private departmentService: DepartmentService,
        private elementRef: ElementRef,
        private emergencyLocationService: EmergencyLocationService,
        private emergencyTypeService: EmergencyTypeService,
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

        this.getAllActiveOrganizations();
        this.getAllActiveAircraftTypes();
        this.getIncidentsToPickForReplication();
        this.getIncident(this.currentIncidentId);
        this.getDepartment(this.currentDepartmentId);
        this.getPagePermission();

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChange,
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange,
            (model: KeyValue) => this.departmentChangeHandler(model));
    }

    public ngAfterViewInit(): void {
        jQuery('li.tab-item').on('click', () => {
            const firstVisibleNestedTab: any = jQuery('.tab-containet li.nav-item:visible:first-child a');
            if (firstVisibleNestedTab.length > 0) {
                const url: string = jQuery('.tab-containet li.nav-item:visible:first-child a').attr('href');
                this.router.navigateByUrl(url);
            }
        });
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
            $self.find('#tab-container').show();
            $self.find('#error-container').hide();

            const accessibleTabs: string[] = GlobalConstants.PagePermissionMatrix
                .filter((x: PagesPermissionMatrixModel) => {
                    return x.ParentPageId === rootTab.PageId &&
                        x.DepartmentId === this.currentDepartmentId;
                })
                .map((x) => x.PageCode);

            if (accessibleTabs.length > 0) {
                console.log(GlobalConstants.DashboardTabLinks);
                this.tablinks = GlobalConstants.DashboardTabLinks
                    .filter((x: ITabLinkInterface) => accessibleTabs.some((y) => y === x.id));

                if (this.tablinks) {
                    this.tablinks.forEach((item: ITabLinkInterface) => {
                        const parent: PagesPermissionMatrixModel = GlobalConstants.PagePermissionMatrix
                            .find((itemPagePermission: PagesPermissionMatrixModel) => {
                                return (itemPagePermission.PageCode == item.id &&
                                    itemPagePermission.DepartmentId === this.currentDepartmentId);
                            });

                        if (item.subtab) {
                            item.subtab.forEach((itemSubTab: ITabLinkInterface, index: number) => {
                                const subPageModel: PagesPermissionMatrixModel = GlobalConstants.PagePermissionMatrix
                                    .find((x: PagesPermissionMatrixModel) => {
                                        return (x.PageCode == itemSubTab.id && x.ParentPageId == parent.PageId &&
                                            x.DepartmentId === this.currentDepartmentId);
                                    });
                                if (subPageModel == undefined) {
                                    //itemSubTab.selected = false;
                                    //item.subtab.splice(index,1);
                                    //item.subtab
                                }
                                else {
                                    itemSubTab.selected = true;
                                }
                            });
                        }

                    });
                }

                UtilityService.SelectFirstTab(this.tablinks, this.router);
            }
        }
        else {
            this.tablinks = [];
            const $self: JQuery = jQuery(this.elementRef.nativeElement);
            $self.find('#tab-container').hide();
            $self.find('#error-container').show();
        }
        // this.tablinks = TAB_LINKS;
    }

    public ngAfterContentInit(): void {
    }

    getAllActiveOrganizations(): void {
        this.organizationService.GetAllActiveOrganizations()
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<OrganizationModel>) => {
                this.activeOrganizations = response.Records;
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

    getIncidentsToPickForReplication(): void {
        this.incidentService.GetLastConfiguredCountIncidents()
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<IncidentModel>) => {
                this.incidentsToPickForReplication = response.Records;
                this.incidentsToPickForReplication.map((item: IncidentModel) => {
                    if (item.ClosedOn != null) {
                        item.EmergencyName = item.EmergencyName + ' (closed)';
                    }
                });
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    public getAllActiveEmergencyTypes(): void {
        this.emergencyTypeService.GetAll()
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<EmergencyTypeModel>) => {
                this.activeEmergencyTypes = response.Records;
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    public ngOnDestroy(): void {
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.IncidentChange);
        // this.globalState.Unsubscribe(GlobalConstants.DataExchangeConstant.DepartmentChange);
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }



    private getIncident(incidentId: number): void {
        this.incidentService.Get(incidentId)
            .subscribe((data: IncidentModel) => {
                this.currentIncident = new KeyValue(data.EmergencyName, data.IncidentId);
                // try{
                //     if(typeof data.CreatedOn == 'string')
                //         this.incidentDate = new Date((data.CreatedOn as string).substr(0,23));
                //     else
                //         this.incidentDate = new Date(data.CreatedOn.toISOString().substr(0,23));
                // }
                // catch(ex){
                //     this.incidentDate = new Date(data.CreatedOn);
                // }
                this.incidentDate = new Date(data.CreatedOn);
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    private getDepartment(departmentId: number): void {
        this.departmentService.Get(departmentId)
            .subscribe((data) => {
                this.currentDepartment = new KeyValue(data.Description, data.DepartmentId);
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncident = incident;
        this.currentIncidentId = incident.Value;
        this.getIncident(incident.Value);
        this.globalState.NotifyDataChanged(GlobalConstants.DataExchangeConstant.IncidentChangefromDashboard, incident);
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartment = department;
        this.currentDepartmentId = department.Value;
        this.getPagePermission();
        this.isShowViewReadonlyCrisis = UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'ViewReadonlyCrisis');
        this.globalState.NotifyDataChanged(GlobalConstants.DataExchangeConstant.DepartmentChangeFromDashboard, department);
    }
}