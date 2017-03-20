import { BaseModel } from '../../../../shared';
import { DepartmentModel } from '../../../masterdata/department';
import {
    AffectedModel,
    AffectedPeopleModel,
    AffectedObjectModel,
    EnquiryModel
} from '../../../shared.components';
import { DemandModel } from '../../../dashboard/demand';

export class InterestedpartyModel extends BaseModel {
    public InterestedPartyId: number;
    public IncidentId?: number;
    public AffectedId?: number;
    public InterestedPartyName: string;
    public ContactNumber: string;
    public AlternateContactNumber: string;
    public Relationship: string;
    public EmailId: string;
    public Location: string;


    public Affected?: AffectedModel;
    public Enquiries?: EnquiryModel[];

    constructor() {
        super();

        this.InterestedPartyId = 0;
        this.IncidentId = null;
        this.AffectedId = null;
        this.InterestedPartyName = '';
        this.ContactNumber = '';
        this.AlternateContactNumber = '';
        this.Relationship = '';
        this.EmailId = '';
        this.Location = '';
    }
}