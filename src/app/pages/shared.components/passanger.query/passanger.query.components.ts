import {
    Component, ViewEncapsulation,
    OnInit, AfterContentInit
} from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { GlobalConstants } from '../../../shared/constants';

@Component({
    selector: 'other-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/passenger.query.view.html'
})
export class PassangerQueryComponent implements OnInit, AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngOnInit(): void {
    }

    public ngAfterContentInit(): void {
        debugger;
        if (GlobalConstants.TabLinks.some((x) => x.id === 'PassengerQuery'))
            this.subTabs = GlobalConstants.TabLinks.find((x) => x.id === 'PassengerQuery').subtab;
    }
}