import { NgModule } from '@angular/core';
import { BaseModel, KeyValue } from '../../../shared';


export class PeopleOnBoardModel extends BaseModel {
    public enquiredAffectedPassengerCount: number;
    public totalAffectedPassengerCount: number;
    public enquiredAffectedCrewCount: number;
    public totalAffectedCrewCount: number;
    public totalGenderTypeCount: KeyValue[];
    public totalNationalityTypeCount: KeyValue[];
    public totalPaxTypeCount: KeyValue[];
    public totalAffectedCargoCount: number;
    public cargoOnBoardCountByType: KeyValue[];
    public totalGroundVictimCount: number;

    
    constructor() {
        super();
     
        this.enquiredAffectedPassengerCount = 0;
        this.totalAffectedPassengerCount = 0;
        this.enquiredAffectedCrewCount = 0;
        this.totalAffectedCrewCount = 0;
        this.totalGenderTypeCount = new Array<KeyValue>();
        this.totalNationalityTypeCount = new Array<KeyValue>();
        this.totalPaxTypeCount = new Array<KeyValue>();
        this.totalAffectedCargoCount = 0;
        this.cargoOnBoardCountByType = new Array<KeyValue>();
        this.totalGroundVictimCount = 0;
    }
}
