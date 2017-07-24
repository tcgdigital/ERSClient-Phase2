import { Component, ViewEncapsulation, AfterContentInit, OnInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { UtilityService } from '../../../shared/services/common.service';
import { Router } from '@angular/router';
import {
    KeyValue, GlobalStateService
} from '../../../shared';
@Component({
    selector: 'crew-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/crew.query.view.html'
})
export class CrewQueryComponent implements OnInit, AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();
    constructor(private globalState: GlobalStateService, private router: Router) {

    }
    public ngOnInit(): void {
        if (this.router.url.indexOf('Archieve') > 0) {
            //Archieve Dashboard
            this.globalState.Subscribe('departmentChange', (model: KeyValue) => {
                this.subTabs = UtilityService.GetArchieveDashboardSubTabs('CrewQuery');
            });
        }
        else {
            //Dashboard
            this.globalState.Subscribe('departmentChange', (model: KeyValue) => {
                this.subTabs = UtilityService.GetDashboardSubTabs('CrewQuery');
            });
        }
    }
    public ngAfterContentInit(): void {
        if (this.router.url.indexOf('Archieve') > 0) {
            //Archieve Dashboard
            this.subTabs = UtilityService.GetArchieveDashboardSubTabs('CrewQuery');
        }
        else {
            //Dashboard
            this.subTabs = UtilityService.GetDashboardSubTabs('CrewQuery');
        }
    }

}