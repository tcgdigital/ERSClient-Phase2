import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DataServiceFactory, DataExchangeService, TextAccordionModel, GlobalStateService } from '../../../shared'
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
    currentIncidentId: number;
    currentDepartmentId: number;

    /**
     * Creates an instance of BroadcastWidgetComponent.
     * @param {BroadcastWidgetService} broadcastWidgetService 
     * @param {DataExchangeService<BroadcastWidgetModel>} dataExchange 
     * 
     * @memberOf BroadcastWidgetComponent
     */
    constructor(private broadcastWidgetService: BroadcastWidgetService,
        private dataExchange: DataExchangeService<BroadcastWidgetModel>, private globalState: GlobalStateService) { }

    public ngOnInit(): void {
        this.currentIncidentId = this.incidentId;
        this.currentDepartmentId = this.departmentId;
        this.getLatestBroadcasts(this.currentDepartmentId, this.currentIncidentId);
        this.getAllPublishedBroadcasts(this.currentIncidentId);
        this.globalState.Subscribe('incidentChange', (model) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model) => this.departmentChangeHandler(model));
    }

    private incidentChangeHandler(incidentId): void {
        this.incidentId = incidentId;
        this.getLatestBroadcasts(this.currentDepartmentId, this.currentIncidentId);
        this.getAllPublishedBroadcasts(this.currentIncidentId);
    }

    private departmentChangeHandler(departmentId): void {
        this.departmentId = departmentId;
        this.getAllPublishedBroadcasts(this.currentIncidentId);
    }

    public getLatestBroadcasts(departmentId, incidentId): void {
        let data: BroadcastWidgetModel[] = [];
        this.broadcastWidgetService
            .GetLatestBroadcastsByIncidentAndDepartment(departmentId, incidentId)
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

    public getAllPublishedBroadcasts(incidentId): void {
        let data: BroadcastWidgetModel[] = [];
        this.broadcastWidgetService
            .GetAllPublishedBroadcastsByIncident(incidentId)
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
