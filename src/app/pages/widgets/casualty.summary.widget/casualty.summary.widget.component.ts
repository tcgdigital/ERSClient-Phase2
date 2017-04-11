import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { CasualtySummeryModel } from './casualty.summary.widget.model';
import { CasualtySummaryWidgetService } from './casualty.summary.widget.service';


@Component({
    selector: 'casualty-summary-widget',
    templateUrl: './casualty.summary.widget.view.html',
    encapsulation: ViewEncapsulation.None
})
export class CasualtySummaryWidgetComponent implements OnInit {
    @Input('currentIncidentId') incidentId: number;
    
    public casualtySummery: CasualtySummeryModel;
    constructor(private casualtySummaryWidgetService: CasualtySummaryWidgetService) { }

    public ngOnInit(): void {
        this.casualtySummery = new CasualtySummeryModel();
        this.casualtySummaryWidgetService.GetCasualtyCount(this.incidentId)
            .subscribe(casualtySummeryObservable => {
                this.casualtySummery = casualtySummeryObservable;
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

   
}