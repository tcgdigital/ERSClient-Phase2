import { Component, ViewEncapsulation } from '@angular/core';
import { TAB_LINKS } from './masterdata.tablink';
import { ITabLinkInterface  } from '../../shared';

@Component({
    selector: 'master-data',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './masterdata.view.html'
})
export class MasterDateComponent {
    public tablinks: ITabLinkInterface[];
    constructor() {
    }

    public ngOnInit(): void {
        this.tablinks = TAB_LINKS;
    }

}