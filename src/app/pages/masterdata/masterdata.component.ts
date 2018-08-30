import { Component, ViewEncapsulation, ElementRef } from '@angular/core';
import { Router } from "@angular/router";
import { ITabLinkInterface, GlobalConstants, UtilityService, KeyValue, GlobalStateService } from '../../shared';
import { PagesPermissionMatrixModel } from '../masterdata';

@Component({
    selector: 'master-data',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './masterdata.view.html'
})
export class MasterDateComponent {
    public tablinks: ITabLinkInterface[];
    public currentDepartmentId: number;
    public accessibilityErrorMessage: string = GlobalConstants.accessibilityErrorMessage;

    constructor(private router: Router, private elementRef: ElementRef, private globalState: GlobalStateService) {
    }

    public ngOnInit(): void {
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.getPagePermission();
        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange, 
            (model: KeyValue) => this.departmentChangeHandler(model));
    }


    getPagePermission(): void {
        const rootTab: PagesPermissionMatrixModel = GlobalConstants.PagePermissionMatrix
            .find((x: PagesPermissionMatrixModel) => {
                return x.ModuleName === 'Master Data Management' &&
                    x.ParentPageId === null && x.Type === 'Tab' &&
                    x.DepartmentId === this.currentDepartmentId
            });
        if (rootTab) {
            const $self: JQuery = jQuery(this.elementRef.nativeElement);
            $self.find('.error').hide();
            $self.find('.tab-root-container').show();
            const accessibleTabs: string[] = GlobalConstants.PagePermissionMatrix
                .filter((x: PagesPermissionMatrixModel) => {
                    return x.ParentPageId === rootTab.PageId &&
                        x.DepartmentId === this.currentDepartmentId
                })
                .map((x) => x.PageCode);
            if (accessibleTabs.length > 0) {
                this.tablinks = GlobalConstants.MasterDataTAB_LINKS.filter((x: ITabLinkInterface) => accessibleTabs.some((y) => y === x.id));
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

    departmentChangeHandler(department: KeyValue): void {
        this.currentDepartmentId = department.Value;
        this.getPagePermission();
    }

}