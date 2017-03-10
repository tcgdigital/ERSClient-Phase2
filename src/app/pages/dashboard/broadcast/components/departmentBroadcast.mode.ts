import { DepartmentModel } from '../../../masterdata/department';
import { BaseModel } from '../../../../shared';

export class DepartmentBroadcastModel extends BaseModel {
    public DepartmentBroadcastId: number;
    public DepartmentId: number;
    public BroadcastId: number;
    public IsSelected: boolean;

    public Department?: DepartmentModel;

    /**
     * Creates an instance of DepartmentBroadcastModel.
     * 
     * @memberOf DepartmentBroadcastModel
     */
    constructor() {
        super();
        this.DepartmentBroadcastId = 0;
        this.DepartmentId = 0;
        this.BroadcastId = 0;
    }
}