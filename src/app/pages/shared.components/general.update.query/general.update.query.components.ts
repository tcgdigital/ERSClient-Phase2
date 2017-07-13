import { Component, ViewEncapsulation, OnInit, AfterContentInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { GlobalConstants } from '../../../shared/constants';

@Component({
    selector: 'other-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/general.update.query.view.html'
})
export class GeneralUpdateQueryComponent implements OnInit, AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngOnInit(): void {
    }

    public ngAfterContentInit(): void {
        if (GlobalConstants.TabLinks.some((x) => x.id === 'GeneralUpdateQuery'))
            this.subTabs = GlobalConstants.TabLinks.find((x) => x.id === 'GeneralUpdateQuery').subtab;
    }
}