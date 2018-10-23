import { Component, ViewEncapsulation, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { ITabLinkInterface } from '../../../shared/components/tab.control';
import { Observable, Subject } from 'rxjs/Rx';
import { GroundVictimModel } from '../ground.victim/components/ground.victim.model';
import { PeopleOnBoardWidgetService } from '../../widgets/peopleOnBoard.widget/peopleOnBoard.widget.service';
import { InvolvePartyModel } from '../../shared.components/involveparties';
import {
    ResponseModel, UtilityService,
    GlobalStateService, KeyValue, SearchConfigModel,
    SearchTextBox, NameValue, GlobalConstants
} from '../../../shared';

@Component({
    selector: 'crew-query',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/ground.victims.view.html',
    styleUrls: ['./styles/ground.victims.scss']
})
export class GroundVictimsComponent implements OnInit, OnDestroy, AfterContentInit {
    public currentIncidentId: number;
    public currentDepartmentId: number;
    public groundVictimList: Observable<GroundVictimModel[]>;
    public searchConfigs: Array<SearchConfigModel<any>> = Array<SearchConfigModel<any>>();
    public subTabs: ITabLinkInterface[] = new Array<ITabLinkInterface>();
    expandSearch: boolean = false;
    searchValue: string = 'Expand Search';
    private ngUnsubscribe: Subject<any> = new Subject<any>();

    /**
     *Creates an instance of GroundVictimsComponent.
     * @param {PeopleOnBoardWidgetService} peopleOnBoardWidgetService
     * @param {GlobalStateService} globalState
     * @memberof GroundVictimsComponent
     */
    constructor(private peopleOnBoardWidgetService: PeopleOnBoardWidgetService,
        private globalState: GlobalStateService) { }

    public ngOnInit(): void {
        this.currentIncidentId = +UtilityService.GetFromSession('CurrentIncidentId');
        this.currentDepartmentId = +UtilityService.GetFromSession('CurrentDepartmentId');
        this.openAllGroundVictims();
        this.initiateSearchConfigurations();

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.IncidentChange,
            (model: KeyValue) => this.incidentChangeHandler(model));

        this.globalState.Subscribe(GlobalConstants.DataExchangeConstant.DepartmentChange,
            (model: KeyValue) => this.departmentChangeHandler(model));

        // this.subTabs = _.find(GlobalConstants.TabLinks, (x) => x.id === 'CrewQuery').subtab;
        // Signal Notification
        this.globalState.Subscribe
            (GlobalConstants.NotificationConstant.ReceiveIncidentBorrowingCompletionResponse.Key, () => {
                this.openAllGroundVictims();
            });
    }

    public ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    public ngAfterContentInit(): void {
        // this.subTabs = UtilityService.GetSubTabs('GroundVictims');
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
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((result: ResponseModel<InvolvePartyModel>) => {
                groundVictimListLocal = result.Records[0].GroundVictims;
                this.groundVictimList = Observable.of(groundVictimListLocal);
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
            });
    }

    expandSearchPanel(value): void {
        if (!value) {
            this.searchValue = 'Hide Search Panel';
        }
        else {
            this.searchValue = 'Expand Search Panel';
        }
        this.expandSearch = !this.expandSearch;

    }

    invokeSearch(query: string): void {
        let groundVictimListLocal: GroundVictimModel[] = [];
        if (query !== '') {
            query = `${query}`;
            this.peopleOnBoardWidgetService.GetGroundVictimsByQuery(query, this.currentIncidentId)
                // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
                .takeUntil(this.ngUnsubscribe)
                .subscribe((response: ResponseModel<InvolvePartyModel>) => {
                    response.Records.forEach((x) => {
                        x.Active = (x.ActiveFlag === 'Active');
                    });
                    groundVictimListLocal = response.Records[0].GroundVictims;
                    this.groundVictimList = Observable.of(groundVictimListLocal);
                }, (error: any) => {
                    console.log(`Error: ${error.message}`);
                });
        }
        else {
            this.peopleOnBoardWidgetService.GetAllGroundVictimsByIncident(this.currentIncidentId)
                // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
                .takeUntil(this.ngUnsubscribe)
                .subscribe((result: ResponseModel<InvolvePartyModel>) => {
                    groundVictimListLocal = result.Records[0].GroundVictims;
                    this.groundVictimList = Observable.of(groundVictimListLocal);
                }, (error: any) => {
                    console.log(`Error: ${error.message}`);
                });
        }
    }

    invokeReset(): void {
        let groundVictimListLocal: GroundVictimModel[] = [];
        this.peopleOnBoardWidgetService.GetAllGroundVictimsByIncident(this.currentIncidentId)
            // .debounce(() => Observable.timer(GlobalConstants.DEBOUNCE_TIMEOUT))
            .takeUntil(this.ngUnsubscribe)
            .subscribe((result: ResponseModel<InvolvePartyModel>) => {
                groundVictimListLocal = result.Records[0].GroundVictims;
                this.groundVictimList = Observable.of(groundVictimListLocal);
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
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
            new SearchTextBox({
                Name: 'Status',
                Description: 'Status',
                // PlaceHolder: 'Select Status',
                Value: ''
                // ListData: Observable.of(status)
            })
        ];
    }
}