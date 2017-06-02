import { NgModule } from '@angular/core';

import { BaseModel } from '../../../../shared';
import { DepartmentModel } from '../../department';
import { EmergencyTypeModel } from '../../emergencytype';
import { OrganizationModel } from "../../../shared.components/organization";

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
    public OrganizationId: number;
    public Stations?: string
    public StationList? : string[];

    public TargetDepartment: DepartmentModel;
    public ParentCheckList?: ChecklistModel;
    public EmergencyType: EmergencyTypeModel;
    public Organization: OrganizationModel;

    constructor(flag?: boolean) {
        super();
        if (flag) {
            this.CheckListId = 0;
            this.CheckListCode = '';
            this.CheckListDetails = '';
            this.ParentCheckListId = 0;
            this.Duration = 0;
            this.DepartmentId = 0;
            this.URL = '';
            this.EmergencyTypeId = 0;
            this.Sequence = 0;
            this.Active = false;
            this.Stations = '';
            this.StationList = [];
        }
    }
}

export class CheckListStationModel{
    station: string;
    IsSelected: boolean;
}