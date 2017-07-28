import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ToastrService, ToastrConfig } from 'ngx-toastr';


import { DepartmentService, DepartmentModel } from '../department';
import { PageService, PagePermissionService } from './components';
import {
    PageModel, PagePermissionModel,
    PagesForDepartmentModel
} from './components/page.functionality.model';
import {
    DataExchangeService, ResponseModel,GlobalConstants,
    AutocompleteComponent, KeyValue, AuthModel, UtilityService
} from '../../../shared';


@Component({
    selector: 'page-functionality',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/page.functionality.view.html',
    styleUrls: ['./styles/page.functionality.style.scss']
})
export class PageFunctionalityComponent implements OnInit {
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

    constructor(private pageService: PageService,
        private pagePermissionService: PagePermissionService,
        private departmentService: DepartmentService, private toastrService: ToastrService,
        private toastrConfig: ToastrConfig) { }

    getDepartments(): void {
        this.departmentService.GetAll()
            .subscribe((response: ResponseModel<DepartmentModel>) => {
                this.departments = response.Records;
                this.departments.forEach((item: DepartmentModel) => {
                    this.items.push(new KeyValue(item.DepartmentName, item.DepartmentId));
                });

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

        this.pagePermissionService.CreateBulk(this.pagePermissionModelToSave)
            .subscribe((response: PagePermissionModel[]) => {
                this.toastrService.success(`Department Funtionality saved Successfully. ${GlobalConstants.departmentAndFunctionalityReloginMessage}`, 'Success', this.toastrConfig);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    onNotify(message: KeyValue): void {
        this.selectedDepartment = message.Value;
        this.pagePermissionService.GetFilter(message.Value.toString())
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
        this.pagesForDepartment = [];
        this.allSelectView = false;
        this.allSelectOnlyHOD = false;
    }

    ngOnInit(): any {
        this.allSelectView = false;
        this.allSelectOnlyHOD = false;
        this.getDepartments();
        this.credential = UtilityService.getCredentialDetails();
        this.pageService.GetPagesOrderBySortOrder()
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

            });
    }
}