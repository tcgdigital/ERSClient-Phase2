import { Component, ViewEncapsulation, AfterContentInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { UtilityService } from '../../../shared/services/common.service';

@Component({
    selector: 'affectedpeople-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/affected.people.view.html',
    styleUrls: ['./styles/affected.people.style.scss']
})
export class AffectedPeopleComponent implements AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();


     public ngAfterContentInit(): void {
        this.subTabs = UtilityService.GetSubTabs('AffectedPeople');
    }
    
}