import { Component, ViewEncapsulation, AfterContentInit, OnInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { UtilityService } from '../../../shared/services/common.service';
import { Router } from '@angular/router';
import {
    KeyValue, GlobalStateService
} from '../../../shared';

@Component({
    selector: 'demand-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/demand.view.html',
    styleUrls: ['./styles/demand.style.scss']
})
export class DemandComponent implements OnInit, AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();
    /**
     *
     */
    constructor(private globalState: GlobalStateService, private router: Router) {

    }
    public ngOnInit(): void {
        if (this.router.url.indexOf('Archieve') > 0) {
            //Archieve Dashboard
            this.globalState.Subscribe('departmentChange', (model: KeyValue) => {
                this.subTabs = UtilityService.GetArchieveDashboardSubTabs('Demand');
            });
        }
        else {
            //Dashboard
            this.globalState.Subscribe('departmentChange', (model: KeyValue) => {
                this.subTabs = UtilityService.GetDashboardSubTabs('Demand');
            });
        }
    }

    public ngAfterContentInit(): void {
        if (this.router.url.indexOf('Archieve') > 0) {
            //Archieve Dashboard
            this.subTabs = UtilityService.GetArchieveDashboardSubTabs('Demand');
        }
        else {
            //Dashboard
            this.subTabs = UtilityService.GetDashboardSubTabs('Demand');
        }
    }

}