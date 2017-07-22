import { Component, ViewEncapsulation, AfterContentInit, OnInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { UtilityService } from '../../../shared/services/common.service';
import { Router } from '@angular/router';
import {
    KeyValue, GlobalStateService
} from '../../../shared';
@Component({
    selector: 'cargo-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/cargo.query.view.html'
})
export class CargoQueryComponent implements OnInit, AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();
    constructor(private globalState: GlobalStateService, private router: Router) {

    }
    
    public ngOnInit(): void {
        if (this.router.url.indexOf('Archieve') > 0) {
            //Archieve Dashboard
            this.globalState.Subscribe('departmentChange', (model: KeyValue) => {
                this.subTabs = UtilityService.GetArchieveDashboardSubTabs('CargoQuery');
            });
        }
        else {
            //Dashboard
            this.globalState.Subscribe('departmentChange', (model: KeyValue) => {
                this.subTabs = UtilityService.GetDashboardSubTabs('CargoQuery');
            });
        }
    }

    public ngAfterContentInit(): void {
        if (this.router.url.indexOf('Archieve') > 0) {
            //Archieve Dashboard
            this.subTabs = UtilityService.GetArchieveDashboardSubTabs('CargoQuery');
        }
        else {
            //Dashboard
            this.subTabs = UtilityService.GetDashboardSubTabs('CargoQuery');
        }
    }


}