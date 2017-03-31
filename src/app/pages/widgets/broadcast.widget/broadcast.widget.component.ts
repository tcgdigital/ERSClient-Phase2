import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DataServiceFactory, DataExchangeService, TextAccordionModel } from '../../../shared'
import { BroadcastWidgetModel } from './broadcast.widget.model'
import { BroadcastWidgetService } from './broadcast.widget.service'

@Component({
    selector: 'broadcast-widget',
    templateUrl: './broadcast.widget.view.html',
    styleUrls: ['./broadcast.widget.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BroadcastWidgetComponent implements OnInit {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;

    LatestBroadcasts: Observable<TextAccordionModel[]>;
    AllPublishedBroadcasts: Observable<BroadcastWidgetModel[]>;
    isHidden: boolean = true;

    /**
     * Creates an instance of BroadcastWidgetComponent.
     * @param {BroadcastWidgetService} broadcastWidgetService 
     * @param {DataExchangeService<BroadcastWidgetModel>} dataExchange 
     * 
     * @memberOf BroadcastWidgetComponent
     */
    constructor(private broadcastWidgetService: BroadcastWidgetService,
        private dataExchange: DataExchangeService<BroadcastWidgetModel>) { }

    public ngOnInit(): void {
        this.getLatestBroadcasts();
        this.getAllPublishedBroadcasts();
    }

    public getLatestBroadcasts(): void {
        let data: BroadcastWidgetModel[] = [];
        this.broadcastWidgetService
            .GetLatestBroadcastsByIncidentAndDepartment(this.departmentId, this.incidentId)
            .flatMap(x => x).take(2)
            .subscribe(x => {
                data.push(x);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            }, () => {
                this.LatestBroadcasts = Observable.of(data
                    .map((x: BroadcastWidgetModel) => new TextAccordionModel(x.Message, x.SubmittedOn)));
            });        
    }

    public getAllPublishedBroadcasts(): void {
        let data: BroadcastWidgetModel[] = [];
        this.broadcastWidgetService
            .GetAllPublishedBroadcastsByIncident(this.incidentId)
            .flatMap(x => x)
            .subscribe(x => {
                data.push(x);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            }, () =>
                this.AllPublishedBroadcasts = Observable.of(data)
            );
    }

    public openBroadcastMessages(isHide: boolean, event: Event) {
        this.isHidden = isHide;
        event.preventDefault();
    }
}
