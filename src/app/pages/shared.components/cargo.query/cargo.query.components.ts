import { Component, ViewEncapsulation,  AfterContentInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { UtilityService } from '../../../shared/services/common.service';

@Component({
    selector: 'cargo-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/cargo.query.view.html'
})
export class CargoQueryComponent implements  AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngAfterContentInit(): void {
        this.subTabs = UtilityService.GetSubTabs('CargoQuery');
    }

    
}