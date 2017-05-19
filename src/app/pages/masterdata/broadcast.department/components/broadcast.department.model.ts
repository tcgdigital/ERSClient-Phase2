import { BaseModel } from '../../../../shared';
import { DepartmentModel } from '../../../masterdata/department';

export class BroadCastDepartmentModel extends BaseModel {
    public BroadcastDepartmentMappingId: number;
    public InitiationDepartmentId: number;
    public TargetDepartmentId: number;
    public IsSelected: boolean;

    public TargetDepartment: DepartmentModel;
    public InitiationDepartment: DepartmentModel;

    /**
     * Creates an instance of BroadCastDepartmentMappingModel.
     *
     * @memberOf BroadCastDepartmentMappingModel
     */
    constructor(){
        super();
    }
}