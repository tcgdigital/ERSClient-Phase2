import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { PeopleOnBoardWidgetService } from './peopleOnBoard.widget.service';
import { PeopleOnBoardModel } from './peopleOnBoard.widget.model';

@Component({
    selector: 'peopleOnBoard-widget',
    templateUrl: './peopleOnBoard.widget.view.html',
    encapsulation: ViewEncapsulation.None
})
export class PeopleOnBoardWidgetComponent implements OnInit {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;

    peopleOnBoard: PeopleOnBoardModel;

    /**
     * Creates an instance of PeopleOnBoardWidgetComponent.
     * @param {PeopleOnBoardWidgetService} peopleOnBoardWidgetService 
     * 
     * @memberOf PeopleOnBoardWidgetComponent
     */
    constructor(private peopleOnBoardWidgetService: PeopleOnBoardWidgetService) { }

    public ngOnInit(): void {
        this.peopleOnBoard = new PeopleOnBoardModel();
        this.peopleOnBoardWidgetService.GetPeopleOnBoardDataCount(this.incidentId)
            .subscribe(peopleOnBoardObservable => {
                this.peopleOnBoard = peopleOnBoardObservable;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });

    }
}