import { Component, ViewEncapsulation, AfterContentInit, OnInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { UtilityService } from '../../../shared/services/common.service';
import {
    KeyValue, GlobalStateService
} from '../../../shared';
@Component({
    selector: 'media-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/media.view.html',
    styleUrls: ['./styles/media.style.scss']
})
export class MediaComponent implements OnInit, AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();
    constructor(private globalState: GlobalStateService) {

    }
    public ngOnInit(): void {
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => {
            this.subTabs = UtilityService.GetSubTabs('MediaMessage');
        });
    }
    public ngAfterContentInit(): void {
        this.subTabs = UtilityService.GetSubTabs('MediaMessage');
    }


}