import { BaseModel } from '../../../../shared';
import { DepartmentModel } from '../../../masterdata/department';
import { AffectedPeopleModel, AffectedObjectModel, EnquiryModel } from '../../../shared.components';
import { DemandModel } from '../../../dashboard/demand';

export class CommunicationLogModel extends BaseModel {
    public InteractionDetailsId: number;
    public InteractionDetailsType: string;
    public Queries: string;
    public Answers: string;
    public AffectedPersonId?: number;
    public AffectedObjectId?: number;
    public EnquiryId?: number;
    public DemandId?: number;
    public RequesterName: string;
    public RequesterDepartment: string;
    public RequesterType: string;


    public AffectedPerson?: AffectedPeopleModel;
    public AffectedObject?: AffectedObjectModel;
    public Enquiry?: EnquiryModel;
    public Demand?: DemandModel;

    constructor() {
        super();

        this.InteractionDetailsId = 0;
        this.InteractionDetailsType = '';
        this.Queries = '';
        this.Answers = '';
        this.AffectedPersonId = null;
        this.AffectedObjectId = null;
        this.EnquiryId = null;
        this.DemandId = null;
        this.RequesterName = '';
        this.RequesterDepartment = '';
        this.RequesterType = '';
    }
}