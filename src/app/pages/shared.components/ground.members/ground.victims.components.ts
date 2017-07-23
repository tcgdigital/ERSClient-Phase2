import { Component, ViewEncapsulation, OnInit, AfterContentInit } from '@angular/core';
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
export class GroundVictimsComponent implements OnInit, AfterContentInit {
    public currentIncidentId: number;
    public currentDepartmentId: number;
    public groundVictimList: Observable<GroundVictimModel[]>;
    public searchConfigs: Array<SearchConfigModel<any>> = Array<SearchConfigModel<any>>();
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();
    expandSearch: boolean = false;
    searchValue: string = "Expand Search";

    constructor(private peopleOnBoardWidgetService: PeopleOnBoardWidgetService, private globalState: GlobalStateService) { }

    public ngOnInit(): void {
        this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.openAllGroundVictims();
        this.initiateSearchConfigurations();
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model: KeyValue) => this.departmentChangeHandler(model));

        //this.subTabs = _.find(GlobalConstants.TabLinks, (x) => x.id === 'CrewQuery').subtab;
    }
    public ngAfterContentInit(): void {
        //this.subTabs = UtilityService.GetSubTabs('GroundVictims');
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

    expandSearchPanel(value): void {
        if (!value) {
            this.searchValue = "Hide Search Panel";
        }
        else {
            this.searchValue = "Expand Search Panel";
        }
        this.expandSearch = !this.expandSearch;

    }

    invokeSearch(query: string): void {
        let groundVictimListLocal: GroundVictimModel[] = [];
        if (query !== '') {
            query = `${query}`;
            this.peopleOnBoardWidgetService.GetGroundVictimsByQuery(query, this.currentIncidentId)
                .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                    response.Records.forEach((x) => {
                        x.Active = (x.ActiveFlag === 'Active');
                    });
                    groundVictimListLocal = response.Records[0].GroundVictims;
                    this.groundVictimList = Observable.of(groundVictimListLocal);
                }, ((error: any) => {
                    console.log(`Error: ${error}`);
                }));
        }
        else {
            this.peopleOnBoardWidgetService.GetAllGroundVictimsByIncident(this.currentIncidentId)
                .subscribe((result: ResponseModel<InvolvePartyModel>) => {
                    groundVictimListLocal = result.Records[0].GroundVictims;
                    this.groundVictimList = Observable.of(groundVictimListLocal);
                });
        }
    }

    invokeReset(): void {
        let groundVictimListLocal: GroundVictimModel[] = [];
        this.peopleOnBoardWidgetService.GetAllGroundVictimsByIncident(this.currentIncidentId)
            .subscribe((result: ResponseModel<InvolvePartyModel>) => {
                groundVictimListLocal = result.Records[0].GroundVictims;
                this.groundVictimList = Observable.of(groundVictimListLocal);
            });
    }



    private initiateSearchConfigurations(): void {
        const status: Array<NameValue<string>> = [
            new NameValue<string>('Injured', 'Injured'),
            new NameValue<string>('Uninjured', 'Uninjured'),
            new NameValue<string>('Dead', 'Dead'),
        ] as Array<NameValue<string>>;

        this.searchConfigs = [
            new SearchTextBox({
                Name: 'GroundVictimType',
                Description: 'Ground Victim Type',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'GroundVictimName',
                Description: 'Victim Name',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'NOKName',
                Description: 'NOK Name',
                Value: ''
            }),
            new SearchTextBox({
                Name: 'NOKContactNumber',
                Description: 'NOK Contact Number',
                Value: ''
            }),
            new SearchDropdown({
                Name: 'Status',
                Description: 'Status',
                PlaceHolder: 'Select Status',
                Value: '',
                ListData: Observable.of(status)
            })
        ];
    }
}