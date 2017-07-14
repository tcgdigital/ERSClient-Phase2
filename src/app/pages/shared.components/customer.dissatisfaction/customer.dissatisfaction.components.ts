import { Component, ViewEncapsulation,  AfterContentInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { UtilityService } from '../../../shared/services/common.service';

@Component({
    selector: 'other-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/customer.dissatisfaction.view.html'
})
export class CustomerDissatisfactionComponent implements  AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

   public ngAfterContentInit(): void {
        this.subTabs = UtilityService.GetSubTabs('CustomerDissatisfactionQuery');
    }

    
}