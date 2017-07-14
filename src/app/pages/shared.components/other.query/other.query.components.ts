import { Component, ViewEncapsulation, AfterContentInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { UtilityService } from '../../../shared/services/common.service';

@Component({
    selector: 'other-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/other.query.view.html'
})
export class OtherQueryComponent implements  AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

     public ngAfterContentInit(): void {
        this.subTabs = UtilityService.GetSubTabs('OtherQuery');
    }

    
}