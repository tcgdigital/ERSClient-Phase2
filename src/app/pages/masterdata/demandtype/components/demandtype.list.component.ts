import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

import { DemandTypeModel } from './demandtype.model';
import { DemandTypeService } from './demandtype.service';
import { ResponseModel, DataExchangeService } from '../../../../shared';

@Component({
    selector: 'demandtype-list',
    encapsulation: ViewEncapsulation.None,
    templateUrl: '../views/demandtype.list.view.html',
    styleUrls: ['../styles/demandtype.style.scss']
})
export class DemandTypeListComponent implements OnInit {
    demandTypes: DemandTypeModel[] = [];
    demandTypeModelToUpdate: DemandTypeModel = new DemandTypeModel;


    constructor(private demandTypeService: DemandTypeService,
        private dataExchange: DataExchangeService<DemandTypeModel>) { }

    getDemandTypes(): void {
        this.demandTypeService.GetAll()
            .subscribe((response: ResponseModel<DemandTypeModel>) => {
                
                this.demandTypes = response.Records;
                this.demandTypes.forEach(x => {
                    x["Active"] = (x.ActiveFlag == 'Active');
                });
            });
    }



    IsActive(event: any, editedDemandType : DemandTypeModel): void {
        this.demandTypeModelToUpdate.deleteAttributes();
        this.demandTypeModelToUpdate.DemandTypeId = editedDemandType.DemandTypeId;
        this.demandTypeModelToUpdate.ActiveFlag = 'Active';
        if (!event.checked) {
            this.demandTypeModelToUpdate.ActiveFlag = 'InActive';
        }
        this.demandTypeService.Update(this.demandTypeModelToUpdate)
            .subscribe((response: DemandTypeModel) => {
                this.getDemandTypes();
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
    }

    onDemandSuccess(data: DemandTypeModel): void {
        this.getDemandTypes();
    }

    edit(demandTypeModelToUpdate: DemandTypeModel): void {
        let demandTypeModelToSend = Object.assign({}, demandTypeModelToUpdate);
        this.dataExchange.Publish("OnDemandUpdate", demandTypeModelToSend);
    }

    ngOnInit(): any {
        this.getDemandTypes();
        this.dataExchange.Subscribe("demandTypeModelSaved", model => this.onDemandSuccess(model));
        this.dataExchange.Subscribe("demandTypeModelUpdated", model => this.onDemandSuccess(model));
    }

    ngOnDestroy(): void {
        this.dataExchange.Unsubscribe("demandTypeModelUpdated");
        this.dataExchange.Unsubscribe("demandTypeModelSaved");
    }

   
}