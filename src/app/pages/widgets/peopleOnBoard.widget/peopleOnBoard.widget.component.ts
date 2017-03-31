import { Component, OnInit, Input  } from '@angular/core';
import { PeopleOnBoardWidgetService } from './peopleOnBoard.widget.service';
import { PeopleOnBoardModel } from './peopleOnBoard.widget.model';

@Component({
    selector: 'peopleOnBoard-widget',
    templateUrl: './peopleOnBoard.widget.view.html',
    styleUrls: ['./peopleOnBoard.widget.style.scss']
})
export class PeopleOnBoardWidgetComponent implements OnInit {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;
    
    peopleOnBoard: PeopleOnBoardModel = null;
    constructor(private peopleOnBoardWidgetService:PeopleOnBoardWidgetService) { }

    ngOnInit() {
        this.peopleOnBoard = new PeopleOnBoardModel();
        this.peopleOnBoardWidgetService.GetPeopleOnBoardDataCount(this.incidentId)
        .subscribe(peopleOnBoardObservable => {
                this.peopleOnBoard = peopleOnBoardObservable;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
     }
}