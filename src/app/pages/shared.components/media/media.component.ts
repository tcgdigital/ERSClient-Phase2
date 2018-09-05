import { Component, ViewEncapsulation, AfterContentInit, OnInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { UtilityService } from '../../../shared/services/common.service';
import { Router } from '@angular/router';
import {
    KeyValue, GlobalStateService, GlobalConstants
} from '../../../shared';
@Component({
    selector: 'media-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/media.view.html',
    styleUrls: ['./styles/media.style.scss']
})
export class MediaComponent implements OnInit, AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();
    constructor(private globalState: GlobalStateService, private router: Router) {

    }
    public ngOnInit(): void {
        if (this.router.url.indexOf('Archieve') > 0) {
            //Archieve Dashboard
            this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange, (model: KeyValue) => {
                this.subTabs = UtilityService.GetArchieveDashboardSubTabs('MediaMessage');
            });
        }
        else {
            //Dashboard
            this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange, (model: KeyValue) => {
                this.subTabs = UtilityService.GetDashboardSubTabs('MediaMessage');
            });
        }

    }
    public ngAfterContentInit(): void {
        if (this.router.url.indexOf('Archieve') > 0) {
            //Archieve Dashboard
            this.subTabs = UtilityService.GetArchieveDashboardSubTabs('MediaMessage');
        }
        else {
            //Dashboard
            this.subTabs = UtilityService.GetDashboardSubTabs('MediaMessage');
        }
    }


}