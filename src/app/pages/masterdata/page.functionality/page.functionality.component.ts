import { Component, ViewEncapsulation, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { DepartmentService, DepartmentModel } from '../department';
import { PageService, PagePermissionService } from './components';
import {
    PageModel, PagePermissionModel,
    PagesForDepartmentModel
} from './components/page.functionality.model';
import {
    ResponseModel, GlobalConstants,
    KeyValue, AuthModel, UtilityService
} from '../../../shared';
import { Subject } from 'rxjs/Subject';
import { PageFunctionalityHierarchyComponent } from './page.functionality.hierarchy.component';
import { Observable } from 'rxjs';

@Component({
    selector: 'page-functionality',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/page.functionality.view.html',
    styleUrls: ['./styles/page.functionality.style.scss']
})
export class PageFunctionalityComponent implements OnInit, OnDestroy {
    @ViewChild(PageFunctionalityHierarchyComponent)
    public pageFunctionalityHierarchy: PageFunctionalityHierarchyComponent

    departments: DepartmentModel[] = [];
    pages: PageModel[] = [];
    selectedDepartment: number;
    pagesForDepartmentConstant: PagesForDepartmentModel[] = [];
    pagesForDepartment: PagesForDepartmentModel[] = [];
    items: KeyValue[] = [];
    date: Date = new Date();
    pagePermissionModelToSave: PagePermissionModel[] = [];
    credential: AuthModel;
    allSelectView: boolean;
    allSelectOnlyHOD: boolean;
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(private pageService: PageService,
        private pagePermissionService: PagePermissionService,
        private departmentService: DepartmentService, private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) { }

    getDepartments(): void {
        this.departmentService.GetAll()
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<DepartmentModel>) => {
                this.departments = response.Records;
                this.departments.forEach((item: DepartmentModel) => {
                    this.items.push(new KeyValue(item.DepartmentName, item.DepartmentId));
                });
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    SetAllSelectedToFalse(pagesForDepartmentModel: PagesForDepartmentModel[]): any {
        for (const item of pagesForDepartmentModel) {
            item.AllowView = false;
            item.OnlyForHod = false;
        }
        return pagesForDepartmentModel;
    }

    canViewd(item: PagesForDepartmentModel) {
        return (item.AllowView === true || item.OnlyForHod === true);
    }

    isValidView(item: PagesForDepartmentModel) {
        return (item.AllowView == true);
    };

    isValidOnlyForHOD(item: PagesForDepartmentModel) {
        return (item.OnlyForHod == true);
    };

    save(): void {
        /*
        const model = this.pagesForDepartment.filter(this.canViewd);
        const selectedDepartment = this.selectedDepartment;
        const dateNow = this.date;
        const userId = +this.credential.UserId;
        this.pagePermissionModelToSave = model.map((data) => {
            {
                const item = new PagePermissionModel();
                item.PermissionId = 0;
                item.DepartmentId = selectedDepartment;
                item.PageId = data.PageId;
                item.CanView = data.AllowView;
                item.OnlyHOD = data.OnlyForHod;
                item.ActiveFlag = 'Active';
                item.CreatedBy = userId;
                item.CreatedOn = dateNow;
                return item;
            }
        });
        */

        this.pagePermissionModelToSave = this.pageFunctionalityHierarchy
            .GeneratePagePermissionData(this.selectedDepartment);

        if (this.pagePermissionModelToSave.length > 0) {
            this.pagePermissionService.CreateBulkByDepartmentId
                (this.pagePermissionModelToSave, this.selectedDepartment)
                .subscribe((response: PagePermissionModel[]) => {
                    this.toastrService.success(`Department Funtionality saved Successfully. 
                    ${GlobalConstants.departmentAndFunctionalityReloginMessage}`, 'Success', this.toastrConfig);
                }, (error: any) => {
                    console.log(`Error: ${error.message}`);
                });
        }
    }

    onNotify(message: KeyValue): void {
        this.selectedDepartment = message.Value;
        this.pagePermissionService.GetFilter(message.Value.toString())
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<PagePermissionModel>) => {
                this.pagesForDepartment = this.SetAllSelectedToFalse(this.pagesForDepartmentConstant);

                if (response.Count !== 0) {
                    this.pagesForDepartment.forEach((item: PagesForDepartmentModel) => {
                        response.Records.forEach((pagePermission: PagePermissionModel) => {
                            if (item.PageId === pagePermission.PageId) {
                                item.AllowView = true;
                                item.OnlyForHod = pagePermission.OnlyHOD;

                            }
                            item.isOnlyHOD = false;
                            if (item.AllowView == true) {
                                item.isOnlyHOD = true;
                            }
                        });
                    });
                }

                this.checkAllStatusView();
                this.checkAllStatusOnlyHOD();
                this.disableChildIfNotParentAllowView(this.pagesForDepartment);
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    disableChildIfNotParentAllowView(pagesForDepartmentModel: PagesForDepartmentModel[]): void {
        pagesForDepartmentModel.forEach((item: PagesForDepartmentModel) => {
            let filter: boolean = false;
            let pageId: number = item.PageId;
            let filteredChilds: PagesForDepartmentModel[] = pagesForDepartmentModel.filter((itemFilter: PagesForDepartmentModel) => {
                return itemFilter.ParentPageId === pageId;
            });
            if (item.AllowView == false) {
                filter = true;

            }
            else {
                filter = false;
            }
            filteredChilds.map((mappingData: PagesForDepartmentModel) => {
                mappingData.isDisabled = filter;
            });
        });

    }

    selectAllDeptView(value: any): void {
        this.pagesForDepartment.forEach(x => {
            x.AllowView = value.checked;
        });
    }

    selectAllDeptOnlyHOD(value: any): void {
        this.pagesForDepartment.forEach(x => {
            x.OnlyForHod = value.checked;
        });
    }

    checkAllStatusView(): void {
        this.allSelectView = this.pagesForDepartment.length != 0 && this.pagesForDepartment.filter(x => {
            return x.AllowView == true;
        }).length == this.pagesForDepartment.length;
    }

    checkStatusView(event: any, elm: PagesForDepartmentModel): void {
        elm.isOnlyHOD = event.checked;
        if (event.checked == false) {
            elm.OnlyForHod = false;
            this.allSelectOnlyHOD = false;
        }
        this.allSelectView = this.pagesForDepartment.length != 0 && this.pagesForDepartment.filter(x => {
            return x.AllowView == true;
        }).length == this.pagesForDepartment.length;

        this.checkAllStatusOnlyHOD();
        this.disableChildIfNotParentAllowView(this.pagesForDepartment);
        this.CheckUncheckChildPages(event.checked, elm, this.pagesForDepartment);
        this.CheckUncheckParentIfAllChildChange(event.checked, elm, this.pagesForDepartment);
    }

    CheckUncheckParentIfAllChildChange(isChecked: boolean, selectedPage: PagesForDepartmentModel, pagesForDepartment: PagesForDepartmentModel[]): void {
        const parentPageId: number = selectedPage.ParentPageId;
        const parentPage: PagesForDepartmentModel = pagesForDepartment.find((item: PagesForDepartmentModel) => {
            return item.PageId == parentPageId;
        });

        const childPages: PagesForDepartmentModel[] = pagesForDepartment.filter((item: PagesForDepartmentModel) => {
            return item.ParentPageId == parentPage.PageId;
        });

        const filterAllowView: PagesForDepartmentModel[] = childPages.filter((item: PagesForDepartmentModel) => {
            return item.AllowView == isChecked;
        });

        if (filterAllowView.length == childPages.length) {
            parentPage.AllowView = isChecked;
            if (!isChecked) {
                childPages.map((item: PagesForDepartmentModel) => {
                    return item.isDisabled = true;
                });
            }
            this.CheckUncheckParentIfAllChildChange(isChecked, parentPage, pagesForDepartment);
        }
    }

    CheckUncheckChildPages(isChecked: boolean, selectedPage: PagesForDepartmentModel, pagesForDepartment: PagesForDepartmentModel[]): void {
        const selectedChilds = pagesForDepartment.filter((item: PagesForDepartmentModel) => {
            return (item.ParentPageId === selectedPage.PageId);
        });

        selectedChilds.forEach((item: PagesForDepartmentModel) => {
            item.AllowView = isChecked;
            item.isOnlyHOD = isChecked;
            item.isDisabled = !isChecked;
            this.CheckUncheckChildPages(isChecked, item, pagesForDepartment);
        });
    }

    checkAllStatusOnlyHOD(): void {
        this.allSelectOnlyHOD = this.pagesForDepartment.length != 0 && this.pagesForDepartment.filter(x => {
            return x.OnlyForHod == true;
        }).length == this.pagesForDepartment.length;
    }

    invokeReset(): void {
        this.selectedDepartment = 0;
        this.pagesForDepartment = [];
        this.allSelectView = false;
        this.allSelectOnlyHOD = false;
    }

    ngOnInit(): any {
        this.getDepartments();
        /*
        this.allSelectView = false;
        this.allSelectOnlyHOD = false;
        this.getDepartments();
        this.credential = UtilityService.getCredentialDetails();

        this.pageService.GetPagesOrderBySortOrder()
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((response: ResponseModel<PageModel>) => {
                this.pages = response.Records;
                this.pages.forEach((item: PageModel) => {
                    const pageForDepartment = new PagesForDepartmentModel();
                    pageForDepartment.PageId = item.PageId;
                    pageForDepartment.PageName = item.PageName;
                    pageForDepartment.ParentPageId = item.ParentPageId;
                    pageForDepartment.ParentPageName = item.ParentPageId != null ? item.ParentPage.PageName : '';
                    pageForDepartment.ModuleName = item.ModuleName;
                    pageForDepartment.SortOrder = item.SortOrder != null ? item.SortOrder.toString() : '';
                    pageForDepartment.ID = item.ID;
                    pageForDepartment.URL = item.URL;
                    pageForDepartment.Type = item.Type;
                    pageForDepartment.Selected = item.Selected;
                    pageForDepartment.Hidden = item.Hidden;
                    pageForDepartment.AllowView = false;
                    pageForDepartment.OnlyForHod = false;
                    pageForDepartment.isDisabled = false;
                    this.pagesForDepartmentConstant.push(pageForDepartment);
                });
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
        */
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}