import { BaseModel } from '../../../../shared';
import { DepartmentModel } from '../../../masterdata/department/components/department.model'

export class MediaModel extends BaseModel {
    public MediaqueryId: number;
    public Message: string;
    public Remarks: string;
    public InitiateDepartmentId: number;
    public IncidentId: number;
    public IsUpdated: boolean;
    public IsPublished: boolean;
    public PublishedBy?: number;
    public PublishedOn?: Date;

    
    public OrganizationId : number;
    public MediaReleaseType : string;
    public MediaReleaseStatus : string; 
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
     * Creates an instance of MediaQueryModel.
     * 
     * @memberOf MediaQueryModel
     */
    constructor(){
        super();

        this.MediaqueryId = 0;
        this.IsPublished = false;
    }
}

export class MediaReleaseTemplate extends BaseModel {
    public TemplateContent: string;
}