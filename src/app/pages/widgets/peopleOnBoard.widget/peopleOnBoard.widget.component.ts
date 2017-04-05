import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { PeopleOnBoardWidgetService } from './peopleOnBoard.widget.service';
import { PeopleOnBoardModel } from './peopleOnBoard.widget.model';
import { GlobalStateService } from '../../../shared';

@Component({
    selector: 'peopleOnBoard-widget',
    templateUrl: './peopleOnBoard.widget.view.html',
    encapsulation: ViewEncapsulation.None
})
export class PeopleOnBoardWidgetComponent implements OnInit {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;

    peopleOnBoard: PeopleOnBoardModel;
    currentDepartmentId: number;
    currentIncidentId: number;


    /**
     * Creates an instance of PeopleOnBoardWidgetComponent.
     * @param {PeopleOnBoardWidgetService} peopleOnBoardWidgetService 
     * 
     * @memberOf PeopleOnBoardWidgetComponent
     */
    constructor(private peopleOnBoardWidgetService: PeopleOnBoardWidgetService,
        private globalState: GlobalStateService) { }

    getPeopleOnboardCounts(incident): void {
        this.peopleOnBoard = new PeopleOnBoardModel();
        this.peopleOnBoardWidgetService.GetPeopleOnBoardDataCount(incident)
            .subscribe(peopleOnBoardObservable => {
                console.log(peopleOnBoardObservable);
                this.peopleOnBoard = peopleOnBoardObservable;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    };

    public ngOnInit(): void {
        this.currentIncidentId = this.incidentId;
        this.currentDepartmentId = this.departmentId;
        this.getPeopleOnboardCounts(this.currentIncidentId);
        this.globalState.Subscribe('incidentChange', (model) => this.incidentChangeHandler(model));

    };

    private incidentChangeHandler(incidentId): void {
        this.currentIncidentId = incidentId;
        this.getPeopleOnboardCounts(this.currentIncidentId);
    };

    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
    };
}