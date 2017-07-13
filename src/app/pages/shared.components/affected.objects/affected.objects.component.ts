import { Component, ViewEncapsulation, OnInit, AfterContentInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { GlobalConstants } from '../../../shared/constants';

@Component({
    selector: 'affectedobject-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/affected.objects.view.html',
    styleUrls: ['./styles/affected.objects.style.scss']
})
export class AffectedObjectsComponent implements OnInit, AfterContentInit {
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngOnInit(): void {
    }

    public ngAfterContentInit(): void {
        if (GlobalConstants.TabLinks.some((x) => x.id === 'AffectedCargo'))
            this.subTabs = GlobalConstants.TabLinks.find((x) => x.id === 'AffectedCargo').subtab;
    }
}