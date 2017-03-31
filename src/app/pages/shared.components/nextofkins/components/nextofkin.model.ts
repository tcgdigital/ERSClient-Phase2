import { BaseModel } from '../../../../shared';
import { DepartmentModel } from '../../../masterdata';
import { AffectedPeopleModel, EnquiryModel } from '../../../shared.components';

export class NextOfKinModel extends BaseModel {
    public NextOfKinId: number;
    public IncidentId?: number;
    public AffectedPersonId?: number;
    public NextOfKinName: string;
    public ContactNumber: string;
    public AlternateContactNumber: string;
    public Relationship: string;
    public EmailId: string;
    public Location: string;

    public AffectedPerson?: AffectedPeopleModel;
    public Enquiries?: EnquiryModel[];

    /**
     * Creates an instance of NextOfKinModel.
     * 
     * @memberOf NextOfKinModel
     */
    constructor() {
        super();

        this.NextOfKinId = 0;
        this.IncidentId = null;
        this.AffectedPersonId = null;
        this.NextOfKinName = '';
        this.ContactNumber = '';
        this.AlternateContactNumber = '';
        this.Relationship = '';
        this.EmailId = '';
        this.Location = '';
    }
}