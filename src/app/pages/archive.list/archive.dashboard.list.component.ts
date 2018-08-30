import {
    Component, ViewEncapsulation,
    OnInit, OnDestroy, ViewChild
} from '@angular/core';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { EmergencyTypeModel } from '../masterdata';
import { EmergencyLocationModel } from '../masterdata/emergencylocation';
import { IncidentModel, IncidentDataExchangeModel } from '../incident';
import { OrganizationModel, AircraftTypeModel } from '../shared.components';
import { FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import {
    GlobalStateService, UtilityService, KeyValue,
    ResponseModel, Severity, GlobalConstants
} from '../../shared';
import { ArchiveListService } from './archive.dashboard.list.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'archive-dashboard-list',
    styleUrls: ['./archive.dashboard.list.style.scss'],
    templateUrl: './archive.dashboard.list.view.html',
    encapsulation: ViewEncapsulation.None,
})
export class ArchiveDashboardListComponent implements OnInit, OnDestroy {
    @ViewChild('childModalViewClosedIncident')
    public childModalViewClosedIncident: ModalDirective;

    public closedCrisises: any[];
    public formPopup: FormGroup;
    disableIsDrillPopup: boolean;
    severities: KeyValue[] = [];
    isOffSetPopup: boolean = false;
    incidentModel: IncidentModel = null;
    isFlightRelated: boolean = false;
    isFlightRelatedPopup: boolean = false;
    incidentDataExchangeModel: IncidentDataExchangeModel = null;
    currentIncidentId: number;
    currentDepartmentId: number;
    public IsDrillPopup: boolean;
    public useLink: boolean;
    public EmergencyDateLocal: Date;
    public ReportedDateLocal: Date;
    public ScheduleDepartureLocal: Date;
    public ScheduleArrivalLocal: Date;
    public BorrowedIncidentName: string;
    public isShowPage: boolean = true;
    public accessibilityErrorMessage: string = GlobalConstants.accessibilityErrorMessage;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    activeEmergencyTypes: EmergencyTypeModel[] = [];
    affectedStations: EmergencyLocationModel[] = [];
    activeOrganizations: OrganizationModel[] = [];
    activeAircraftTypes: AircraftTypeModel[] = [];
    incidentsToPickForReplication: IncidentModel[] = [];

    constructor(private toastrService: ToastrService,
        private toastrConfig: ToastrConfig,
        private archiveListService: ArchiveListService,
        private globalState: GlobalStateService,
        private router: Router) {
        this.closedCrisises = [];
        this.affectedStations = [];
        this.severities = UtilityService.GetKeyValues(Severity);
    }

    public ngOnInit(): void {
        this.useLink = true;
        this.isFlightRelated = false;
        this.disableIsDrillPopup = true;
        this.isOffSetPopup = false;
        this.GetAllClosedIncidents();

        this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        this.currentDepartmentId = +UtilityService.GetFromSession("CurrentDepartmentId");
        
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange,
            (model: KeyValue) => this.departmentChangeHandler(model));
    }

    public IsReopenCheckedChange(event: any, closedCrisis: IncidentModel): void {
        closedCrisis.isReopen = event.checked;
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
    }

    public GetAllClosedIncidents(): void {
        this.archiveListService.GetAllClosedIncidents()
            .takeUntil(this.ngUnsubscribe)
            .subscribe((closedIncident: ResponseModel<IncidentModel>) => {
                closedIncident.Records.forEach((itemIncident: IncidentModel) => {
                    if (itemIncident.ReOpenBy != null && itemIncident.ReOpenOn != null
                        && itemIncident.ReClosedBy == null && itemIncident.ReClosedOn == null) {
                        itemIncident.isReopen = true;
                    }
                    else {
                        itemIncident.isReopen = false;
                    }

                    const editIncident: KeyValue = { Key: itemIncident.EmergencyName, Value: itemIncident.IncidentId };
                    itemIncident['IncidentView'] = editIncident;
                    this.closedCrisises.push(itemIncident);
                });
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public onSubmitClosedCrisis(closedCrisisList: IncidentModel[]): void {
        // We collect all closed crisis
        const reopenedCrisis = closedCrisisList.filter((item: IncidentModel) => {
            return item.isReopen === true;
        });

        const closedCrisis = closedCrisisList.filter((item: IncidentModel) => {
            return item.isReopen === false;
        });

        if (closedCrisis.length > 0) {
            const objectLiteral1: string = JSON.stringify(closedCrisis);
            const deepCopyIncident1: IncidentModel[] = JSON.parse(objectLiteral1);
            const totalClosedCrisis: IncidentModel[] = deepCopyIncident1.map((item: IncidentModel) => {
                item.ReOpenBy = null
                item.ReOpenOn = null;
                item.EmergencyType = null;
                item.ReClosedBy = +UtilityService.GetFromSession('CurrentUserId');;
                item.ReClosedOn = new Date();
                return item;
            });

            // Again call to the database for update the reopened one.
            this.archiveListService.CreateBulkInsertClosedIncident(totalClosedCrisis)
                .subscribe((result: IncidentModel[]) => {
                    //this.toastrService.success('Incident status updated successfully.', 'Archive Crisis', this.toastrConfig);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
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
                    this.toastrService.success('Incident status updated successfully.', 'Archive Crisis', this.toastrConfig);
                }, (error: any) => {
                    console.log(`Error: ${error}`);
                });
        }
    }

    private onArchivedIncidentClick(incidentId: number, isReopened: boolean): void {
        UtilityService.SetToSession({ ArchieveIncidentId: incidentId });
        UtilityService.SetToSession({ IsReopened: isReopened });
        this.router.navigate(['pages/archivedashboard']);
    }
}
