import { NgModule } from '@angular/core';

import { BaseModel } from '../../../../shared';
import { DepartmentModel } from '../../department';
import { EmergencyTypeModel } from '../../emergencytype';

export class ChecklistModel extends BaseModel {
    public CheckListId: number;
    public CheckListCode: string;
    public CheckListDetails: string;
    public ParentCheckListId: number;
    public Duration: number;
    public DepartmentId: number;
    public URL: string;
    public EmergencyTypeId: number;
    public Sequence: number;
    public Active: boolean;

    public TargetDepartment: DepartmentModel;
    public ParentCheckList?: ChecklistModel;
    public EmergencyType: EmergencyTypeModel;
}