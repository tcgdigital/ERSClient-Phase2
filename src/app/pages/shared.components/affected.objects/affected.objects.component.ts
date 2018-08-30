import { Component, ViewEncapsulation, AfterContentInit, OnInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { UtilityService } from '../../../shared/services/common.service';
import { Router } from '@angular/router';
import {
    KeyValue, GlobalStateService, GlobalConstants
} from '../../../shared';
@Component({
    selector: 'affectedobject-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/affected.objects.view.html',
    styleUrls: ['./styles/affected.objects.style.scss']
})
export class AffectedObjectsComponent implements OnInit, AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();
    constructor(private globalState: GlobalStateService, private router: Router) {

    }
    public ngOnInit(): void {
        if (this.router.url.indexOf('Archieve') > 0) {
            //Archieve Dashboard
            this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange, (model: KeyValue) => {
                this.subTabs = UtilityService.GetArchieveDashboardSubTabs('AffectedCargo');
            });
        }
        else {
            //Dashboard
            this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange, (model: KeyValue) => {
                this.subTabs = UtilityService.GetDashboardSubTabs('AffectedCargo');
            });
        }

    }
    public ngAfterContentInit(): void {
        if (this.router.url.indexOf('Archieve') > 0) {
            //Archieve Dashboard
            this.subTabs = UtilityService.GetArchieveDashboardSubTabs('AffectedCargo');
        }
        else {
            //Dashboard
            this.subTabs = UtilityService.GetDashboardSubTabs('AffectedCargo');
        }
    }


}