import {
    Component, ViewEncapsulation,
    OnInit, SimpleChange, OnDestroy
} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
//import { TAB_LINKS } from './archive.dashboard.tablinks';
import { ITabLinkInterface, GlobalStateService, UtilityService, KeyValue, GlobalConstants } from '../../shared';
import { IncidentService, IncidentModel } from '../incident';
import { DepartmentService, DepartmentModel } from '../masterdata/department';
import { PagesPermissionMatrixModel } from '../masterdata';
@Component({
    selector: 'archive-dashboard',
    templateUrl: './archive.dashboard.view.html',
    styleUrls: ['./archive.dashboard.style.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class ArchiveDashboardComponent implements OnInit {
    public tablinks: ITabLinkInterface[];
    archievedIncidentId: number;
    currentDepartmentId: number;
    currentIncident: KeyValue;
    currentDepartment: KeyValue;
    public incidentDate: Date;
    private sub: any;
    public isShowPage: boolean = true;
    public accessibilityErrorMessage: string = GlobalConstants.accessibilityErrorMessage;
    public isShowViewReadonlyCrisis: boolean = false;
    /**
     * Creates an instance of ArchiveDashboardComponent.
     * @param {ActivatedRoute} router
     * @param {IncidentService} incidentService
     * @param {DepartmentService} departmentService
     *
     * @memberof ArchiveDashboardComponent
     */
    constructor(private router: ActivatedRoute, private incidentService: IncidentService,
        private departmentService: DepartmentService, private globalState: GlobalStateService,
        private routerObj: Router) {
        this.incidentDate = new Date();
    }

    /**
     * ngOnInit
     *
     *
     * @memberof ArchiveDashboardComponent
     */
    public ngOnInit(): void {
        this.archievedIncidentId = +UtilityService.GetFromSession('ArchieveIncidentId');
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.getPagePermission();
        this.isShowViewReadonlyCrisis = UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'ViewReadonlyCrisisInformationforArchive');

        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));
        this.GetIncidentAndDepartment();
    }

    getPagePermission(): void {
        const rootTab: PagesPermissionMatrixModel = GlobalConstants.PagePermissionMatrix
            .find((x: PagesPermissionMatrixModel) => {
                return x.ModuleName === 'Dashboard' &&
                    x.ParentPageId === null && x.Type === 'Tab' &&
                    x.DepartmentId === this.currentDepartmentId
            });

        if (rootTab) {
            const accessibleTabs: string[] = GlobalConstants.PagePermissionMatrix
                .filter((x: PagesPermissionMatrixModel) => {
                    return x.ParentPageId === rootTab.PageId &&
                        x.DepartmentId === this.currentDepartmentId
                })
                .map((x) => x.PageCode);
            if (accessibleTabs.length > 0) {
                this.tablinks = GlobalConstants.ArchieveDashboardTabLinks.filter((x: ITabLinkInterface) => accessibleTabs.some((y) => y === x.id));
                UtilityService.SelectFirstTab(this.tablinks, this.routerObj);
            }
        }
        else {
            this.tablinks = [];
        }
        // this.tablinks = TAB_LINKS;
    }

    /**
     * GetIncidentAndDepartment
     *
     * @private
     *
     * @memberof ArchiveDashboardComponent
     */
    private GetIncidentAndDepartment(): void {
        this.incidentService.Get(this.archievedIncidentId)
            .map((record: IncidentModel) => {
                this.currentIncident = new KeyValue(record.Description, record.IncidentId);
                this.incidentDate = new Date(record.EmergencyDate);
            })
            .flatMap((_) => this.departmentService.Get(this.currentDepartmentId))
            .subscribe((data: DepartmentModel) => {
                this.currentDepartment = new KeyValue(data.Description, data.DepartmentId);
            });
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.isShowViewReadonlyCrisis = UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'ViewReadonlyCrisisInformationforArchive');

        this.getPagePermission();
    }
}