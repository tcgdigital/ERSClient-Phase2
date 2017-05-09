import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { PresidentMessageWidgetModel } from './presidentMessage.widget.model';
import { PresidentMessageModel } from '../../shared.components';
import { PresidentMessageWidgetService } from './presidentMessage.widget.service'
import { DataServiceFactory, DataExchangeService, GlobalStateService, KeyValue, UtilityService } from '../../../shared'
import { ModalDirective } from 'ng2-bootstrap/modal';

@Component({
    selector: 'presidentMessage-widget',
    templateUrl: './presidentMessage.widget.view.html',
    styleUrls: ['./presidentMessage.widget.style.scss']
})
export class PresidentMessageWidgetComponent implements OnInit, OnDestroy {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;
    @ViewChild('childModalPresidentMsg') public childModal: ModalDirective;

    isHidden: boolean = true;
    currentDepartmentId: number;
    currentIncidentId: number;

    presidentMessages: Observable<PresidentMessageWidgetModel[]>;
    AllPresidentMessages: Observable<PresidentMessageWidgetModel[]>;

    constructor(private presidentMessagewidgetService: PresidentMessageWidgetService,
        private dataExchange: DataExchangeService<PresidentMessageWidgetModel>,
        private globalState: GlobalStateService) { }

    public ngOnInit(): void {
        // this.incidentId= +UtilityService.GetFromSession("CurrentDepartmentId");
	    // this.departmentId = +UtilityService.GetFromSession("CurrentIncidentId");
        this.currentIncidentId = this.incidentId;
        this.currentDepartmentId = this.departmentId;
        this.getLatestPresidentsMessages(this.currentIncidentId);
        this.getAllPresidentsMessages();
        this.globalState.Subscribe('incidentChange', (model: KeyValue) => this.incidentChangeHandler(model));
        this.globalState.Subscribe('PresidentMessagePublished', model => this.onPresidentMessagePublish(model));
    }

    private onPresidentMessagePublish(presidentMessage: PresidentMessageModel): void {
        if(presidentMessage.IsPublished){           
            this.getLatestPresidentsMessages(this.currentIncidentId);
        }
    }

    private incidentChangeHandler(incident: KeyValue): void {
        this.currentIncidentId = incident.Value;
        this.getLatestPresidentsMessages(this.currentIncidentId);
        this.getAllPresidentsMessages();
    }

    public ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
        this.globalState.Unsubscribe('PresidentMessagePublished');
    }

    getLatestPresidentsMessages(incidentId): void {
        let data: PresidentMessageWidgetModel[] = [];
        this.presidentMessagewidgetService
            .GetAllPresidentMessageByIncident(incidentId)
            .flatMap(x => x)
            .take(2)
            .subscribe(x => {
                data.push(x);
            }, (error: any) => { },
            () => this.presidentMessages = Observable.of(data));
    }

    getAllPresidentsMessages(callback?: Function): void {
        let data: PresidentMessageWidgetModel[] = [];
        this.presidentMessagewidgetService
            .GetAllPresidentMessageByIncident(this.currentIncidentId)
            .flatMap(x => x)
            .subscribe(x => {
                data.push(x);
            }, (error: any) => { },
            () => {
                this.AllPresidentMessages = Observable.of(data);
                if (callback) {
                    callback();
                }
            });
    }

    openPresidentMessages(): void {
        this.getAllPresidentsMessages(() => {
            this.childModal.show();
        });
    }

    hidePresidentMessages(): void {
        this.childModal.hide();
    }
}