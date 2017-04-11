import {
    Component, ViewEncapsulation,
    OnInit, SimpleChange
} from '@angular/core';
import { TAB_LINKS } from './dashboard.tablink';
import { ITabLinkInterface } from '../../shared';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.view.html',
    styleUrls: ['./dashboard.style.scss'],
    encapsulation: ViewEncapsulation.None,

})
export class DashboardComponent implements OnInit {
    public incidentDate: Date;
    public tablinks: ITabLinkInterface[]

    constructor() {
        this.incidentDate = new Date('apr,10,2017,00:00:00');
    }

    public ngOnInit(): void {
        this.tablinks = TAB_LINKS;
    }
}