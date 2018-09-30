import {
    Component, ViewEncapsulation, ElementRef, OnInit, OnDestroy
} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import {
    ITabLinkInterface, GlobalStateService,
    UtilityService, KeyValue, GlobalConstants
} from '../../shared';
import { IncidentService, IncidentModel } from '../incident';
import { DepartmentService, DepartmentModel } from '../masterdata/department';
import { PagesPermissionMatrixModel } from '../masterdata';
import { Subject, Observable } from 'rxjs';

@Component({
    selector: 'archive-dashboard',
    templateUrl: './archive.dashboard.view.html',
    styleUrls: ['./archive.dashboard.style.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ArchiveDashboardComponent implements OnInit, OnDestroy {
    public tablinks: ITabLinkInterface[];
    archievedIncidentId: number;
    currentDepartmentId: number;
    currentIncident: KeyValue;
    currentDepartment: KeyValue;
    public incidentDate: Date;
    public isArchive: boolean = true;
    public isShowPage: boolean = true;
    public accessibilityErrorMessage: string = GlobalConstants.accessibilityErrorMessage;
    public isShowViewReadonlyCrisis: boolean = false;
    public isReopened: boolean = false;
    public closedDate: Date = new Date();
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     *Creates an instance of ArchiveDashboardComponent.
     * @param {IncidentService} incidentService
     * @param {DepartmentService} departmentService
     * @param {ElementRef} elementRef
     * @param {GlobalStateService} globalState
     * @param {Router} routerObj
     * @memberof ArchiveDashboardComponent
     */
    constructor(private incidentService: IncidentService,
        private departmentService: DepartmentService,
        private elementRef: ElementRef,
        private globalState: GlobalStateService,
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
        this.isReopened = (UtilityService.GetFromSession('IsReopened') == 'true');
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.getPagePermission();
        this.isShowViewReadonlyCrisis = UtilityService.GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'ViewReadonlyCrisisInformationforArchive');

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange,
            (model: KeyValue) => this.departmentChangeHandler(model));
        this.GetIncidentAndDepartment();
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    getPagePermission(): void {
        const rootTab: PagesPermissionMatrixModel = GlobalConstants.PagePermissionMatrix
            .find((x: PagesPermissionMatrixModel) => {
                return x.ModuleName === 'Archive Dashboard' &&
                    x.ParentPageId === null && x.Type === 'Tab' &&
                    x.DepartmentId === this.currentDepartmentId
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
                this.tablinks = GlobalConstants.ArchieveDashboardTabLinks.filter((x: ITabLinkInterface) => accessibleTabs.some((y) => y === x.id));
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
                                    itemSubTab.selected = false;
                                }
                                else {
                                    itemSubTab.selected = true;
                                }
                            });
                        }
                    });
                }

                UtilityService.SelectFirstTab(this.tablinks, this.routerObj);
            }
        }
        else {
            this.tablinks = [];
            const $self: JQuery = jQuery(this.elementRef.nativeElement);
            $self.find('#tab-container').hide();
            $self.find('#error-container').show();
        }
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
            .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .map((record: IncidentModel) => {
                this.currentIncident = new KeyValue(record.EmergencyName, record.IncidentId);
                this.closedDate = record.ClosedOn;
                this.incidentDate = new Date(record.EmergencyDate);
            })
            .flatMap((_) => this.departmentService.Get(this.currentDepartmentId))
            .subscribe((data: DepartmentModel) => {
                this.currentDepartment = new KeyValue(data.Description, data.DepartmentId);
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    private departmentChangeHandler(department: KeyValue): void {
        this.currentDepartment = department;
        this.currentDepartmentId = department.Value;

        this.isShowViewReadonlyCrisis = UtilityService
            .GetNecessaryPageLevelPermissionValidation(this.currentDepartmentId, 'ViewReadonlyCrisisInformationforArchive');

        this.getPagePermission();
    }
}