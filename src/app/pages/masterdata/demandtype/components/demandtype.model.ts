import { BaseModel } from '../../../../shared';
import { DepartmentModel } from '../../department';

export class DemandTypeModel extends BaseModel {
    public DemandTypeId: number;
    public DemandTypeName: string;
    public IsAutoApproved: boolean;
    public DepartmentId?: number;
    public ApproverDepartment?: DepartmentModel;

    constructor() {
        super();
        this.DemandTypeId = 0;
    }
}

export class DemandTypeEntryModel extends BaseModel {
    public DemandTypeId: number;
    public DemandTypeName: string;
    public IsAutoApproved: boolean;
    public Departments: DepartmentModel[];
}

