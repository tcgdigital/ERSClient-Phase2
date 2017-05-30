import { BaseModel } from '../../../../shared';
import { DepartmentModel } from '../../../masterdata/department';
import { IncidentModel } from '../../../incident';
import { ExternalInputModel } from '../../../callcenteronlypage/component';

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
    public EnquiryType: number;
    public IsCallBack?: boolean;
    public IsTravelRequest?: boolean;
    public IsAdminRequest?: boolean;
    public Queries: string;
    public Remarks: string;
    public IncidentId: number;
    public ExternalInputId : number;

    public Caller?: CallerModel;
    public NextOfKin?: NextOfKinModel;
    public Incident: IncidentModel;
    public ExternalInput : ExternalInputModel;

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
        this.EnquiryType = 0;
        this.IsCallBack = null;
        this.IsTravelRequest = null;
        this.IsAdminRequest = null;
        this.Queries = '';
        this.Remarks = '';
        this.IncidentId = 0;
    }
}

export class QueryModel extends BaseModel {
              public  EnquiryId: number;
              public  Queries: string;
              public  CallerName: string;
              public  ContactNumber: string;
              public  AlternateContactNumber: string;
 }




