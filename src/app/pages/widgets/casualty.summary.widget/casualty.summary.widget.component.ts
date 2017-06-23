import { Component, OnInit, ViewEncapsulation, Input , SimpleChange} from '@angular/core';
import { CasualtySummeryModel } from './casualty.summary.widget.model';
import { CasualtySummaryWidgetService } from './casualty.summary.widget.service';

import {
    GlobalStateService
} from '../../../shared';


@Component({
    selector: 'casualty-summary-widget',
    templateUrl: './casualty.summary.widget.view.html',
    encapsulation: ViewEncapsulation.None
})
export class CasualtySummaryWidgetComponent implements OnInit {
    @Input('currentIncidentId') incidentId: number;

    public casualtySummery: CasualtySummeryModel;
    constructor(private casualtySummaryWidgetService: CasualtySummaryWidgetService, private globalState: GlobalStateService) { }

    getCausaltyStatusSummery(incidentId): void {
        this.casualtySummery = new CasualtySummeryModel();
        this.casualtySummaryWidgetService.GetCasualtyCount(incidentId)
            .subscribe(casualtySummeryObservable => {
                this.casualtySummery = casualtySummeryObservable;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    public ngOnInit(): void {
        this.getCausaltyStatusSummery(this.incidentId);
        this.globalState.Subscribe('AffectedPersonStatusChanged', model => this.affectedPeopleStatusChanged());
    }

    affectedPeopleStatusChanged(): void {
        this.getCausaltyStatusSummery(this.incidentId);
    }
    public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        if (changes['incidentId'] !== undefined && (changes['incidentId'].currentValue !==
            changes['incidentId'].previousValue) &&
            changes['incidentId'].previousValue !== undefined) {
            this.getCausaltyStatusSummery(this.incidentId);
        }
    }

    ngOnDestroy() {
        this.globalState.Unsubscribe('AffectedPersonStatusChanged');        
    }
}