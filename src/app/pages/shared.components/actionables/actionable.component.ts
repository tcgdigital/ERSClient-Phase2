import { Component, ViewEncapsulation, AfterContentInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { UtilityService } from '../../../shared/services/common.service';

@Component({
    selector: 'actionable-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/actionable.html',
    styleUrls: ['./styles/actionable.style.scss']
})
export class ActionableComponent implements AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngAfterContentInit(): void {
        this.subTabs = UtilityService.GetSubTabs('Checklist');
    }
}