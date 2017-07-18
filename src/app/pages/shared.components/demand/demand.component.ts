import { Component, ViewEncapsulation, AfterContentInit, OnInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { UtilityService } from '../../../shared/services/common.service';
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
    constructor(private globalState: GlobalStateService) {

    }
    public ngOnInit(): void {
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => {
            this.subTabs = UtilityService.GetSubTabs('Demand');
        });
    }

    public ngAfterContentInit(): void {
        this.subTabs = UtilityService.GetSubTabs('Demand');
    }

}