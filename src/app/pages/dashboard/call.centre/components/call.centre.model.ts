import { BaseModel } from '../../../../shared';
import { DepartmentModel } from '../../../masterdata/department';
import { EmergencyTypeModel } from '../../../masterdata/emergencyType'
import {  } from '../../';

export class EnquiryModel extends BaseModel {
    public EnquiryId
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

    public Caller: CallerModel;
    //  public NextOfKin NextOfKin 
    //  public InterestedParty InterestedParty 
    //  public Media Media 
    //  public Incident Incident

    public CommunicationLogs ? : CommunicationLogModel[];

    constructor() {
        super();
    }
}

export class CallerModel extends BaseModel {
    public CallerId: number;
    public CallerName: string;
    public ContactNumber: string;
    public AlternateContactNumber: string;
    public Relationship: string;
    public EmailId: string;
    public Location: string;

    constructor() {
        super();
    }
}


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

    constructor() {
        super();
    }
}