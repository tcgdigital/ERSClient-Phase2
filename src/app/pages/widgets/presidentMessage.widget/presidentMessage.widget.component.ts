import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { PresidentMessageWidgetModel } from './presidentMessage.widget.model';
import { PresidentMessageWidgetService } from './presidentMessage.widget.service'
import { DataServiceFactory, DataExchangeService ,GlobalStateService } from '../../../shared'
import { ModalDirective } from 'ng2-bootstrap/modal';

@Component({
    selector: 'presidentMessage-widget',
    templateUrl: './presidentMessage.widget.view.html',
    styleUrls: ['./presidentMessage.widget.style.scss']
})
export class PresidentMessageWidgetComponent implements OnInit {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;
    @ViewChild('childModalPresidentMsg') public childModal:ModalDirective;

    isHidden: boolean = true;
    currentDepartmentId: number;
    currentIncidentId: number;

    presidentMessages: Observable<PresidentMessageWidgetModel[]>; 
    AllPresidentMessages: Observable<PresidentMessageWidgetModel[]>;   

    constructor(private presidentMessagewidgetService: PresidentMessageWidgetService,
        private dataExchange: DataExchangeService<PresidentMessageWidgetModel>,
        private globalState: GlobalStateService) { }

    ngOnInit() {
        this.currentIncidentId = this.incidentId;
        this.currentDepartmentId = this.departmentId;
        this.getLatestPresidentsMessages(this.currentIncidentId);
        this.getAllPresidentsMessages();
        this.globalState.Subscribe('incidentChange', (model) => this.incidentChangeHandler(model));
    }
     private incidentChangeHandler(incidentId): void {
        this.currentIncidentId = incidentId;
        this.getLatestPresidentsMessages(this.currentIncidentId);
        this.getAllPresidentsMessages();
    };

    ngOnDestroy(): void {
        this.globalState.Unsubscribe('incidentChange');
    };

    getLatestPresidentsMessages(incidentId): void {
        let data: PresidentMessageWidgetModel[] = [];
        this.presidentMessagewidgetService
            .GetAllPresidentMessageByIncident(incidentId)
            .flatMap(x=>x)
            .take(2)
            .subscribe(x => {
                data.push(x);
            },(error: any)=>{},
            ()=>this.presidentMessages = Observable.of(data));
    }

    getAllPresidentsMessages(callback?: Function): void {
        let data: PresidentMessageWidgetModel[] = [];
        this.presidentMessagewidgetService
            .GetAllPresidentMessageByIncident(this.currentIncidentId)
            .flatMap(x=>x)
            .subscribe(x => {
                data.push(x);
            },(error: any)=>{},
            ()=>{
                    this.AllPresidentMessages = Observable.of(data);
                    if(callback){
                        callback();
                    }
                });
    }
     openPresidentMessages(): void{
        this.getAllPresidentsMessages(()=>{
            this.childModal.show();
        });       
     }

     hidePresidentMessages(): void{
        this.childModal.hide();
     }
}