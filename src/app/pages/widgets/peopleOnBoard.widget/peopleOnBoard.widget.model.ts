import { NgModule } from '@angular/core';
import { BaseModel, KeyValue } from '../../../shared';


export class PeopleOnBoardModel extends BaseModel {
    public enquiredAffectedPassengerCount: number = 0;
    public totalAffectedPassengerCount: number = 0;
    public enquiredAffectedCrewCount: number = 0;
    public totalAffectedCrewCount: number = 0;
    public totalGenderTypeCount: KeyValue[] = [];
    public totalNationalityTypeCount: KeyValue[] = [];
    public totalPaxTypeCount: KeyValue[] = [];
    public totalCargoOnBoardCount: number;
    public cargoOnBoardCountByType: KeyValue[] = [];
    

    
    constructor() {
        super();
        
    }
}
