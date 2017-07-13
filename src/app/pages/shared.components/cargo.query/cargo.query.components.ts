import { Component, ViewEncapsulation, OnInit, AfterContentInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { GlobalConstants } from '../../../shared/constants';

@Component({
    selector: 'cargo-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/cargo.query.view.html'
})
export class CargoQueryComponent implements OnInit, AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngOnInit(): void {
    }

    public ngAfterContentInit(): void {
        if (GlobalConstants.TabLinks.some((x) => x.id === 'CargoQuery'))
            this.subTabs = GlobalConstants.TabLinks.find((x) => x.id === 'CargoQuery').subtab;
    }
}