import { NgModule } from '@angular/core';
import { BaseModel } from '../../../../shared';
import { DepartmentModel } from '../../../masterdata/department';

export class DepartmentAccessOwnerModel extends BaseModel {
    public DepartmentAccessOwnerMappingId: number;
    public DepartmentOwnerId: number;
    public DepartmentDependentId: number;

    public DepartmentOwner: DepartmentModel;
    public DepartmentDependent: DepartmentModel;

    constructor() {
        super();
        this.DepartmentAccessOwnerMappingId = 0;
        this.DepartmentOwnerId = 0;
        this.DepartmentDependentId = 0;
    }
}