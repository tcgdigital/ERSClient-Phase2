import { Component, ViewEncapsulation, OnInit, AfterContentInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { GlobalConstants } from '../../../shared/constants';

@Component({
    selector: 'affectedpeople-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/affected.people.view.html',
    styleUrls: ['./styles/affected.people.style.scss']
})
export class AffectedPeopleComponent implements OnInit, AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngOnInit(): void {
    }

    public ngAfterContentInit(): void {
        debugger;
        if (GlobalConstants.TabLinks.some((x) => x.id === 'AffectedPeople'))
            this.subTabs = GlobalConstants.TabLinks.find((x) => x.id === 'AffectedPeople').subtab;
    }
}