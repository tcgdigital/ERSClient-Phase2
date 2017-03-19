import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'peopleOnBoard-widget',
    templateUrl: './peopleOnBoard.widget.view.html',
    styleUrls: ['./peopleOnBoard.widget.style.scss']
})
export class PeopleOnBoardWidgetComponent implements OnInit,OnDestroy {
    @Input() IncidentId: any;
    constructor() { }

    ngOnInit() { }

    ngOnDestroy() {

    }
}