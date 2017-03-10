import { BaseModel } from '../../../../shared';
import { DepartmentBroadcastModel } from './departmentBroadcast.mode';
import { DepartmentModel } from '../../../masterdata/department';

export class BroadCastModel extends BaseModel{
    public BroadcastId : number;
    public Message : string;
    public InitiateDepartmentId : number;
    public InitiateDepartmentName?: string;
    public IncidentId : number;
    public IsUpdated : boolean;    
    public IsSubmitted : boolean;
    public SubmittedBy?: number;
    public SubmittedOn?: Date;
    public Priority: string; 
    
    public DepartmentBroadcasts :  DepartmentBroadcastModel[];
    public InitiateDepartment?: DepartmentModel;

    /**
     * Creates an instance of BroadCastModel.
     * 
     * @memberOf BroadCastModel
     */
    constructor() {
        super();

        this.BroadcastId = 0;
        this.DepartmentBroadcasts = [];
    }
}

