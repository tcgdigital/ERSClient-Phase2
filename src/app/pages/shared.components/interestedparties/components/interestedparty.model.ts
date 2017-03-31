import { BaseModel } from '../../../../shared';
import { DepartmentModel } from '../../../masterdata';
import {
    AffectedModel,
    AffectedPeopleModel,
    AffectedObjectModel,
    EnquiryModel,
    DemandModel
} from '../../../shared.components';

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

    /**
     * Creates an instance of InterestedpartyModel.
     * 
     * @memberOf InterestedpartyModel
     */
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