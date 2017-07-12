import { Component, ViewEncapsulation, OnInit, AfterContentInit } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { GlobalConstants } from '../../../shared/constants';

import {
    ApprovedDemandComponent, AssignedDemandComponent,
    CompletedDemandComponent, MyDemandComponent
} from './components';
import { PagesPermissionMatrixModel } from '../../masterdata/page.functionality';

@Component({
    selector: 'demand-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/demand.view.html',
    styleUrls: ['./styles/demand.style.scss']
})
export class DemandComponent implements OnInit, AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngOnInit(): void {
    }

    public ngAfterContentInit(): void {
        const rootTab: PagesPermissionMatrixModel = GlobalConstants.PagePermissionMatrix
            .find((x: PagesPermissionMatrixModel) => x.PageCode === 'Demand' && x.Type === 'Tab');

        if (rootTab) {
            const tabs: string[] = GlobalConstants.PagePermissionMatrix
                .filter((x: PagesPermissionMatrixModel) => x.ParentPageId === rootTab.PageId)
                .map((x) => x.PageCode);

            if (tabs.length > 0) {
               this.subTabs = GlobalConstants.TabLinks.find((y: ITabLinkInterface) => y.id === 'Demand')
                    .subtab.filter((x: ITabLinkInterface) => tabs.some((y) => y === x.id));
            }
        }
    }
}