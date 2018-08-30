import { Component, ViewEncapsulation, AfterContentInit, OnInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { UtilityService } from '../../../shared/services/common.service';
import { Router } from '@angular/router';
import {
    KeyValue, GlobalStateService, GlobalConstants
} from '../../../shared';
@Component({
    selector: 'other-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/future.travel.query.view.html'
})
export class FutureTravelQueryComponent implements OnInit, AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();
    constructor(private globalState: GlobalStateService, private router: Router) {

    }
    public ngOnInit(): void {
        if (this.router.url.indexOf('Archieve') > 0) {
            //Archieve Dashboard
            this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange, (model: KeyValue) => {
                this.subTabs = UtilityService.GetArchieveDashboardSubTabs('FutureTravelQuery');
            });
        }
        else {
            //Dashboard
            this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange, (model: KeyValue) => {
                this.subTabs = UtilityService.GetDashboardSubTabs('FutureTravelQuery');
            });
        }
    }
    public ngAfterContentInit(): void {
        if (this.router.url.indexOf('Archieve') > 0) {
            //Archieve Dashboard
            this.subTabs = UtilityService.GetArchieveDashboardSubTabs('FutureTravelQuery');
        }
        else {
            //Dashboard
            this.subTabs = UtilityService.GetDashboardSubTabs('FutureTravelQuery');
        }
    }

}