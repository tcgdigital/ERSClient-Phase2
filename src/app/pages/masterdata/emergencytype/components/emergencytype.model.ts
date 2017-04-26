import { BaseModel } from '../../../../shared';

export class EmergencyTypeModel extends BaseModel {
    public EmergencyTypeId: number;
    public EmergencyTypeName: string;
    public EmergencyCategory: string;

    public Active?: boolean;

    constructor(){
        super();
    }
}