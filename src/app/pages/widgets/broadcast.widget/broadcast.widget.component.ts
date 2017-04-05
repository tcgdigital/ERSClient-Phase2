import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DataServiceFactory, DataExchangeService, TextAccordionModel, GlobalStateService } from '../../../shared'
import { BroadcastWidgetModel } from './broadcast.widget.model'
import { BroadcastWidgetService } from './broadcast.widget.service'
import { ModalDirective } from 'ng2-bootstrap/modal';

@Component({
    selector: 'broadcast-widget',
    templateUrl: './broadcast.widget.view.html',
    styleUrls: ['./broadcast.widget.style.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BroadcastWidgetComponent implements OnInit {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;
    @ViewChild('childModal') public childModal: ModalDirective;

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
        this.getAllPublishedBroadcasts();
        this.globalState.Subscribe('incidentChange', (model) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('departmentChange', (model) => this.departmentChangeHandler(model));
    };

    private incidentChangeHandler(incidentId): void {
        this.currentIncidentId = incidentId;
        this.getLatestBroadcasts(this.currentDepartmentId, this.currentIncidentId);
        this.getAllPublishedBroadcasts();
    };

    private departmentChangeHandler(departmentId): void {
        this.currentDepartmentId = departmentId;
        this.getLatestBroadcasts(this.currentDepartmentId, this.currentIncidentId);
    };


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

    public getAllPublishedBroadcasts(callback?: Function): void {
        let data: BroadcastWidgetModel[] = [];
        this.broadcastWidgetService
            .GetAllPublishedBroadcastsByIncident(this.currentIncidentId)
            .flatMap(x => x)
            .subscribe(x => {
                data.push(x);
            }, (error: any) => {
                console.log(`Error: ${error}`);
            }, () => {
                this.AllPublishedBroadcasts = Observable.of(data);
                if (callback) {
                    callback();
                }
            });
    };

    public openBroadcastMessages(): void {
        this.getAllPublishedBroadcasts(() => {
            this.childModal.show();
        });
    };

    public hideAllBroadcastMessages(): void {
        this.childModal.hide();
    };

    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('departmentChange');
    }
}
