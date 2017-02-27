import { NgModule } from '@angular/core';
import { BaseModel,KeyValue } from '../../../../shared';
import { EmergencyTypeModel } from '../../emergencyType/components/emergencyType.model';
import { DepartmentModel } from '../../department/components/department.model';

export class IncidentModel extends BaseModel {
    public IncidentId: number;
    public IsDrill: boolean;
    public EmergencyTypeId: number;
    public IncidentStatus: string;
    public EmergencyName: string;
    public AlertMessage: string;
    public Description: string;
    public ClosureNote: string;
    public EmergencyDate: Date;
    public Severity: string;
    public EmergencyLocation: string;
    public IsSubmitted: boolean;
    public IsSaved: boolean;
    public Remarks: string;
    public ClosedBy?: number;
    public ClosedOn?: Date;
    public ReOpenBy?: boolean;
    public ReOpenOn?: Date;
    public ReClosedBy?: number;
    public ReClosedOn?: Date;
    public SubmittedBy?: number;
    public SubmittedOn?: Date;
    public SavedBy?: number;
    public SavedOn?: Date;
    public DepartmentId: number;


    public Active: boolean;

    public EmergencyType: EmergencyTypeModel;
    public Department: DepartmentModel;
}

