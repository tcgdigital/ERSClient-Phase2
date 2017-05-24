import { NgModule } from '@angular/core';
import { BaseModel, KeyValue } from '../../../../shared';
import { CallerModel } from "../../caller";
import { IncidentModel } from "../../../incident/components";
import { ExternalInputModel } from "../../../callcenteronlypage/component";



export class PDAEnquiryModelToView extends BaseModel {

    public ExternalInputId: number;
    public CallerName: string;
    public PassengerName: string;
    public Age: number;
    public FlightNumber: string;
    public DepartedFrom: string;
    public TravellingTo: string;
    public TravellingWith: string;
    public EnquiryReason: string;
    public Query: string;

}