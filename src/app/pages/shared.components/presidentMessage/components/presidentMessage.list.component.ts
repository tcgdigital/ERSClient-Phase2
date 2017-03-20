import { Component, OnInit, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { PresidentMessageModel } from './presidentMessage.model';
import { PresidentMessageService } from './presidentMessage.service';
import { ResponseModel, DataExchangeService } from '../../../../shared';

@Component({
    selector: 'presidentMessage-detail',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/presidentMessage.list.view.html'
})
export class PresidentMessageListComponent implements OnInit, OnDestroy {
    @Input() initiatedDepartmentId: string;
    @Input() currentIncidentId: string;

    PresidentsMessages: PresidentMessageModel[] = [];

    /**
     * Creates an instance of PresidentMessageDetailComponent.
     * @param {PresidentMessageService} presidentMessageService 
     * @param {DataExchangeService<PresidentMessageModel>} dataExchange 
     * 
     * @memberOf PresidentMessageDetailComponent
     */
    constructor(private presidentMessageService: PresidentMessageService,
        private dataExchange: DataExchangeService<PresidentMessageModel>) { }

    getPresidentMessages(): void {
        this.presidentMessageService.Query(+this.initiatedDepartmentId, +this.currentIncidentId)
            .subscribe((response: ResponseModel<PresidentMessageModel>) => {                
                this.PresidentsMessages = response.Records; 
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });       
    }

    onPresidentMessageSuccess(presidentMessage: PresidentMessageModel): void {
        console.log("Event Calling");
        this.getPresidentMessages();
    }

    UpdatePresidentMessage(presidentMessageModelUpdate: PresidentMessageModel): void {
        let presidentMessageModelToSend = Object.assign({}, presidentMessageModelUpdate)
        this.dataExchange.Publish("OnPresidentMessageUpdate", presidentMessageModelToSend);
    }

    ngOnInit(): any {
        this.getPresidentMessages();
        this.dataExchange.Subscribe("PresidentMessageModelSaved", model => this.onPresidentMessageSuccess(model));
        this.dataExchange.Subscribe("PresidentMessageModelUpdated", model => this.onPresidentMessageSuccess(model));    
    }

    ngOnDestroy(): void{
        this.dataExchange.Unsubscribe('PresidentMessageModelSaved');
        this.dataExchange.Unsubscribe('PresidentMessageModelUpdated');
    }
}