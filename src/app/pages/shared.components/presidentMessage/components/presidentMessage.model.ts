import { BaseModel } from '../../../../shared';
import { DepartmentModel } from '../../../masterdata/department/components/department.model'

export class PresidentMessageModel extends BaseModel {
    public PresidentsMessageId: number;
    public Message: string;
    public Remarks: string;
    public InitiateDepartmentId: number;
    public IncidentId: number;
    public IsUpdated: boolean;
    public IsPublished: boolean;
    public PublishedBy: number;
    public PublishedOn?: Date;

    public OrganizationId : number;
    public PresidentMessageType : string;
    public PresidentMessageStatus : string; 
    public SentForApprovalContent : string;
    public SentForApprovalOn? : Date;

    public ApprovedContent : string;
    public ApprovedOn? : Date;    
    public ApprovedBy? : number;
    public RejectedBy? : number;
    public RejectedOn? : Date;
    public ApproverDepartmentId? : number;

    public PublisherDepartmentId? : number;

    public InitiateDepartment? : DepartmentModel
    public ApproverDepartment? : DepartmentModel
    public PublisherDepartment? : DepartmentModel

    /**
     * Creates an instance of PresidentMessageModel.
     * 
     * @memberOf PresidentMessageModel
     */
    constructor() {
        super();

        this.PresidentsMessageId = 0;
        this.IsPublished = false;
    }
}

export class PresidentMessageTemplate extends BaseModel {
    public TemplateContent: string;
}