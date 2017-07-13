import { Component, ViewEncapsulation, OnInit, AfterContentInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { GlobalConstants } from '../../../shared/constants';

@Component({
    selector: 'media-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/media.view.html',
    styleUrls: ['./styles/media.style.scss']
})
export class MediaComponent implements OnInit, AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngOnInit(): void {
    }

    public ngAfterContentInit(): void {
        if (GlobalConstants.TabLinks.some((x) => x.id === 'MediaMessage'))
            this.subTabs = GlobalConstants.TabLinks.find((x) => x.id === 'MediaMessage').subtab;
    }
}