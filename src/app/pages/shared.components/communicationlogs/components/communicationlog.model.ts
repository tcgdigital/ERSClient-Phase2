import { BaseModel } from '../../../../shared';
import { DepartmentModel } from '../../../masterdata';
import {
    AffectedPeopleModel,
    AffectedObjectModel,
    EnquiryModel,
    DemandModel
} from '../../../shared.components';

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

    /**
     * Creates an instance of CommunicationLogModel.
     * 
     * @memberOf CommunicationLogModel
     */
    constructor() {
        super();
    }
}