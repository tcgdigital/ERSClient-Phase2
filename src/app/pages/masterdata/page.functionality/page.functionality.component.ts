import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ToastrService, ToastrConfig } from 'ngx-toastr';


import { DepartmentService, DepartmentModel } from '../department';
import { PageService, PagePermissionService } from './components';
import {
    PageModel, PagePermissionModel,
    PagesForDepartmentModel
} from './components/page.functionality.model';
import {
    DataExchangeService, ResponseModel,
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
                this.toastrService.success('Department Funtionality saved Successfully.', 'Success', this.toastrConfig);
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
                        });
                    });
                }

                // for (const item2 of this.pagesForDepartment) {
                //     if (response.Count !== 0) {
                //         for (const model of response.Records) {
                //             if (item2.PageId === model.PageId) {
                //                 item2.AllowView = true;
                //                 item2.OnlyForHod = model.OnlyHOD;
                //             }
                //         }
                //     }
                // }
                this.checkAllStatusView();
                this.checkAllStatusOnlyHOD();
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
                    pageForDepartment.ParentPageName = item.ParentPageId!=null?item.ParentPage.PageName:'';
                    pageForDepartment.ModuleName=item.ModuleName;
                    pageForDepartment.SortOrder=item.SortOrder!=null?item.SortOrder.toString():'';
                    pageForDepartment.AllowView = false;
                    pageForDepartment.OnlyForHod = false;
                    this.pagesForDepartmentConstant.push(pageForDepartment);
                });
                
            });
    }
}