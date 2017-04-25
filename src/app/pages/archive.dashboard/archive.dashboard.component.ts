import {
    Component, ViewEncapsulation,
    OnInit, SimpleChange, OnDestroy
} from '@angular/core';
import { TAB_LINKS } from './archive.dashboard.tablinks';
import { ITabLinkInterface, GlobalStateService, UtilityService, KeyValue } from '../../shared';

@Component({
    selector: 'archive-dashboard',
    templateUrl: './archive.dashboard.view.html',
    styleUrls: ['./archive.dashboard.style.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class ArchiveDashboardComponent implements OnInit, OnDestroy {
    public tablinks: ITabLinkInterface[];

    constructor() { }

    public ngOnInit(): void { 
        this.tablinks = TAB_LINKS;
    }

    public ngOnDestroy(): void { }
}