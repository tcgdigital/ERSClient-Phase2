import { BaseModel } from '../../../../shared';
import { DepartmentModel } from '../../../masterdata/department';
import { IncidentModel } from '../../../incident';
import {
    CallerModel,
    CommunicationLogModel,
    NextOfKinModel,
    MediaModel,
    AffectedPeopleModel,
    AffectedObjectModel,
    InterestedpartyModel
} from '../../../shared.components';

export class EnquiryModel extends BaseModel {
    public EnquiryId: number;
    public AffectedPersonId?: number;
    public AffectedObjectId?: number;
    public CallerId?: number;
    public NextOfKinId?: number;
    public MediaId?: number;
    public InterestedPartyId?: number;
    public EnquiryType: number;
    public IsCallBack?: boolean;
    public IsTravelRequest?: boolean;
    public IsAdminRequest?: boolean;
    public Queries: string;
    public Remarks: string;
    public IncidentId: number;

    public Caller?: CallerModel;
    public NextOfKin?: NextOfKinModel;
    public InterestedParty?: InterestedpartyModel;
    public Media?: MediaModel;
    public Incident: IncidentModel;

    public AffectedPeople?: AffectedPeopleModel[];
    public AffectedObjects?: AffectedObjectModel[];
    public CommunicationLogs?: CommunicationLogModel[];

    constructor() {
        super();

        this.EnquiryId = 0;
        this.AffectedPersonId = null;
        this.AffectedObjectId = null;
        this.CallerId = null;
        this.NextOfKinId = null;
        this.MediaId = null;
        this.InterestedPartyId = null;
        this.EnquiryType = 0;
        this.IsCallBack = null;
        this.IsTravelRequest = null;
        this.IsAdminRequest = null;
        this.Queries = '';
        this.Remarks = '';
        this.IncidentId = 0;
    }
}




