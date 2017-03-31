import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { PresidentMessageWidgetModel } from './presidentMessage.widget.model';
import { PresidentMessageWidgetService } from './presidentMessage.widget.service'
import { DataServiceFactory, DataExchangeService } from '../../../shared'
@Component({
    selector: 'presidentMessage-widget',
    templateUrl: './presidentMessage.widget.view.html',
    styleUrls: ['./presidentMessage.widget.style.scss']
})
export class PresidentMessageWidgetComponent implements OnInit {
    @Input('initiatedDepartmentId') departmentId: number;
    @Input('currentIncidentId') incidentId: number;
    isHidden: boolean = true;

    presidentMessages: Observable<PresidentMessageWidgetModel[]>; 
    AllPresidentMessages: Observable<PresidentMessageWidgetModel[]>;   

    constructor(private presidentMessagewidgetService: PresidentMessageWidgetService,
        private dataExchange: DataExchangeService<PresidentMessageWidgetModel>) { }

    ngOnInit() {
        this.getLatestPresidentsMessages();
        this.getAllPresidentsMessages();
    }

    getLatestPresidentsMessages(): void {
        let data: PresidentMessageWidgetModel[] = [];
        this.presidentMessagewidgetService
            .GetAllPresidentMessageByIncident(this.incidentId)
            .flatMap(x=>x)
            .take(2)
            .subscribe(x => {
                data.push(x);
            },(error: any)=>{},
            ()=>this.presidentMessages = Observable.of(data));
    }

    getAllPresidentsMessages(): void {
        let data: PresidentMessageWidgetModel[] = [];
        this.presidentMessagewidgetService
            .GetAllPresidentMessageByIncident(this.incidentId)
            .flatMap(x=>x)
            .subscribe(x => {
                data.push(x);
            },(error: any)=>{},
            ()=>this.AllPresidentMessages = Observable.of(data));
    }

     openPresidentMessages(isHide: boolean, event: Event){
         this.isHidden = isHide;
         event.preventDefault();
     }
}