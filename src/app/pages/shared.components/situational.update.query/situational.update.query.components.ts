import {
    Component, ViewEncapsulation,
    OnInit, AfterContentInit
} from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { GlobalConstants } from '../../../shared/constants';

@Component({
    selector: 'other-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/situational.update.query.view.html'
})
export class SituationalUpdateQueryComponent implements OnInit, AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngOnInit(): void {
    }

    public ngAfterContentInit(): void {
        debugger;
        if (GlobalConstants.TabLinks.some((x) => x.id === 'SituationalUpdatesQuery'))
            this.subTabs = GlobalConstants.TabLinks.find((x) => x.id === 'SituationalUpdatesQuery').subtab;
    }
}