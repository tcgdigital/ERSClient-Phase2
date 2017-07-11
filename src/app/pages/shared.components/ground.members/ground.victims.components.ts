import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import * as _ from 'underscore';
import { Observable } from 'rxjs/Rx';
import { GroundVictimModel } from "../ground.victim/components/ground.victim.model";
import { PeopleOnBoardWidgetService } from '../../widgets/peopleOnBoard.widget/peopleOnBoard.widget.service';
import { PeopleOnBoardModel } from '../../widgets/peopleOnBoard.widget/peopleOnBoard.widget.model';
import { InvolvePartyModel } from '../../shared.components/involveparties';
import {
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService,
    ServiceBase, UtilityService,
    GlobalStateService, KeyValue, SearchConfigModel,
    SearchTextBox, SearchDropdown,
    NameValue, GlobalConstants
} from '../../../shared';

@Component({
    selector: 'crew-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/ground.victims.view.html'
})
export class GroundVictimsComponent implements OnInit {
    public currentIncidentId: number;
    public currentDepartmentId: number;
    public groundVictimList: Observable<GroundVictimModel[]>;
    //public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();
    constructor(private peopleOnBoardWidgetService: PeopleOnBoardWidgetService, private globalState: GlobalStateService) { }


    public ngOnInit(): void {
        this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.openAllGroundVictims();
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));

        //this.subTabs = _.find(GlobalConstants.TabLinks, (x) => x.id === 'CrewQuery').subtab;
    }


    public incidentChangeHandler(model: KeyValue): void {
        this.currentIncidentId = model.Value;
        this.openAllGroundVictims();
    }

    public departmentChangeHandler(model: KeyValue): void {
        this.currentDepartmentId = model.Value;
        this.openAllGroundVictims();
    }

    public openAllGroundVictims(): void {
        let groundVictimListLocal: GroundVictimModel[] = [];
        this.peopleOnBoardWidgetService.GetAllGroundVictimsByIncident(this.currentIncidentId)
            .subscribe((result: ResponseModel<InvolvePartyModel>) => {
                groundVictimListLocal = result.Records[0].GroundVictims;
                this.groundVictimList = Observable.of(groundVictimListLocal);
            });
    }
}