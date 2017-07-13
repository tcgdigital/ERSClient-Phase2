import { Component, ViewEncapsulation, OnInit, AfterContentInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { GlobalConstants } from '../../../shared/constants';

@Component({
    selector: 'actionable-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/actionable.html',
    styleUrls: ['./styles/actionable.style.scss']
})
export class ActionableComponent implements OnInit, AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngOnInit(): void {
    }

    public ngAfterContentInit(): void {
        if (GlobalConstants.TabLinks.some((x) => x.id === 'Checklist'))
            this.subTabs = GlobalConstants.TabLinks.find((x) => x.id === 'Checklist').subtab;
    }
}