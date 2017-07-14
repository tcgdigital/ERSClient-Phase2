import { Component, ViewEncapsulation, AfterContentInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { UtilityService } from '../../../shared/services/common.service';

@Component({
    selector: 'presidentMessage-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/presidentMessage.view.html',
    styleUrls: ['./styles/presidents.message.style.scss']
})
export class PresidentMessageComponent implements AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngAfterContentInit(): void {
        this.subTabs = UtilityService.GetSubTabs('PresidentMessage');
    }

    
}
