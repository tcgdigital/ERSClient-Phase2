import { BaseModel } from '../../../../shared';
import { DepartmentModel } from '../../department';
import { EmergencyTypeModel } from '../../emergencytype'

export class EmergencyDepartmentModel extends BaseModel {
    public EmergencyTypeDepartmentId: number;
    public EmergencyTypeId: number;
    public DepartmentId: number;

    public EmergencyType?: EmergencyTypeModel;
    public Department?: DepartmentModel;
}

export class DepartmesForEmergency extends BaseModel {
    public DepartmentId: number;
    public DepartmentName: string;
    public IsSelected: boolean;
}