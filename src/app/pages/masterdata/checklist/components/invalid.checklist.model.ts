import { BaseModel } from '../../../../shared';

export class InvalidChecklistModel extends BaseModel{
    public InvalidCheckListId : number;
    public CheckListCode : string;
    public CheckListDetails : string;
    public ParentCheckListCode : string;
    public Duration?: number;
    public TargetDepartmentName?: number;
    public URL: string; 
    public EmergencyTypeName : string; 
    public ErrorMessage : string; 
    public IsActive : string; 
    public Sequence : string; 
}