import { Component, OnInit, AfterContentInit } from '@angular/core';
import {
    GlobalConstants, UtilityService,
    GlobalStateService, ITabLinkInterface, KeyValue
} from '../../../shared';
import { Router } from '@angular/router';

@Component({
    selector: 'ground-victim-query',
    templateUrl: './views/ground.victim.query.view.html'
})

export class GroundVictimQueryComponent implements OnInit, AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    constructor(private globalState: GlobalStateService,
        private router: Router) { }

    public ngOnInit(): void {
        if (this.router.url.indexOf('Archieve') > 0) {
            //Archieve Dashboard
            this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange,
                (model: KeyValue) => {
                    this.subTabs = UtilityService.GetArchieveDashboardSubTabs('GroundVictimQuery');
                });
        }
        else {
            //Dashboard
            this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange,
                (model: KeyValue) => {
                    this.subTabs = UtilityService.GetDashboardSubTabs('GroundVictimQuery');
                });
        }
    }

    public ngAfterContentInit(): void {
        if (this.router.url.indexOf('Archieve') > 0) {
            //Archieve Dashboard
            this.subTabs = UtilityService.GetArchieveDashboardSubTabs('GroundVictimQuery');
        }
        else {
            //Dashboard
            this.subTabs = UtilityService.GetDashboardSubTabs('GroundVictimQuery');
        }
    }
}