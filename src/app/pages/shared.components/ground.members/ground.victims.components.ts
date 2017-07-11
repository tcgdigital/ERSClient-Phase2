import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import * as _ from 'underscore';
import { GlobalConstants } from '../../../shared/constants';
import { GroundVictimModel } from "../ground.victim/components/ground.victim.model";

@Component({
    selector: 'crew-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/ground.victims.view.html'
})
export class GroundVictimsComponent implements OnInit {
    //public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();

    public ngOnInit(): void {
        //this.subTabs = _.find(GlobalConstants.TabLinks, (x) => x.id === 'CrewQuery').subtab;
    }
}