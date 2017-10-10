import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import * as moment from 'moment';
import { AdditionalInfoModel } from './additional.info.widget.model';
import { UtilityService } from '../../../shared/services';
import { IncidentService,IncidentModel } from "../../incident";
import {
    ResponseModel
} from '../../../shared';

@Injectable()
export class AdditionalInfoWidgetService {
    public additionalInfoModel:AdditionalInfoModel;
    constructor(private incidentService: IncidentService) {
        this.additionalInfoModel=new AdditionalInfoModel();
    }


    GetAdditionalInfoByIncident(incidentId: number,callback?: ((_: AdditionalInfoModel) => void)): void  {
        this.incidentService.GetAdditionalInfoByIncident(incidentId)
        .subscribe((resultOutput:ResponseModel<IncidentModel>)=>{
            if(resultOutput.Count>0){

                this.additionalInfoModel.IncidentId=resultOutput.Records[0].IncidentId;
                this.additionalInfoModel.EmergencyLocation=resultOutput.Records[0].EmergencyLocation;
                this.additionalInfoModel.WhereHappend=resultOutput.Records[0].WhereHappend;
                if(resultOutput.Records[0].InvolvedParties.length>0){
                    if(resultOutput.Records[0].InvolvedParties[0].Flights.length>0){
                        this.additionalInfoModel.FlightNo=resultOutput.Records[0].InvolvedParties[0].Flights[0].FlightNo;
                        this.additionalInfoModel.ArrivalDate=resultOutput.Records[0].InvolvedParties[0].Flights[0].ArrivalDate;
                        this.additionalInfoModel.DepartureDate=resultOutput.Records[0].InvolvedParties[0].Flights[0].DepartureDate;
                        this.additionalInfoModel.DestinationCode=resultOutput.Records[0].InvolvedParties[0].Flights[0].DestinationCode;
                        this.additionalInfoModel.OriginCode=resultOutput.Records[0].InvolvedParties[0].Flights[0].OriginCode;
                        this.additionalInfoModel.FlightTaleNumber=resultOutput.Records[0].InvolvedParties[0].Flights[0].FlightTaleNumber;
                        this.additionalInfoModel.EmergencyCategory=resultOutput.Records[0].EmergencyType.EmergencyCategory;
                    }
                }
            }
            if(callback){
                callback(this.additionalInfoModel);
            }
        });
    }
}