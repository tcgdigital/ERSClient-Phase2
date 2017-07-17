import { Component, ViewEncapsulation,  AfterContentInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { UtilityService } from '../../../shared/services/common.service';

@Component({
    selector: 'media-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/media.view.html',
    styleUrls: ['./styles/media.style.scss']
})
export class MediaComponent implements  AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngAfterContentInit(): void {
        this.subTabs = UtilityService.GetSubTabs('MediaMessage');
    }

    
}