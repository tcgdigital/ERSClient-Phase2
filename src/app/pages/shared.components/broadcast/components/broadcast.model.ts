import { BaseModel } from '../../../../shared';
import { DepartmentBroadcastModel } from './departmentBroadcast.mode';
import { DepartmentModel } from '../../../masterdata/department';
import { IncidentModel } from '../../../incident';

export class BroadCastModel extends BaseModel {
    public BroadcastId: number;
    public Message: string;
    public InitiateDepartmentId: number;
    public IncidentId: number;
    public IsUpdated: boolean;
    public IsSubmitted: boolean;
    public SubmittedBy?: number;
    public SubmittedOn?: Date;
    public Priority: string;


    public InitiateDepartment?: DepartmentModel;
    public Incident?: IncidentModel;
    public DepartmentBroadcasts: DepartmentBroadcastModel[];



    constructor() {
        super();

        this.BroadcastId = 0;
        this.Message = '';
        this.InitiateDepartmentId = 0;
        this.IncidentId = 0;
        this.IsUpdated = false;
        this.IsSubmitted = false;
        this.SubmittedBy = null;
        this.SubmittedOn = null;
        this.Priority = '';
    }
}

