import { BaseModel } from '../../../../shared';
import { DepartmentModel } from '../../../masterdata';
import { EnquiryModel,DemandModel, NextOfKinModel } from '../../../shared.components';

export class CallerModel extends BaseModel {
    public CallerId: number;
    public FirstName: string;
    public LastName: string;
    public ContactNumber: string;
    public AlternateContactNumber: string;
    public Relationship: string;
    public EmailId: string;
    public Location: string;
    public IsNok: boolean;
    

    public Demands?: DemandModel[];
    //public NextOfKin?: NextOfKinModel[];
    public Enquiries?: EnquiryModel[];

    /**
     * Creates an instance of CallerModel.
     * 
     * @memberOf CallerModel
     */
    constructor() {
        super();
      //  this.CallerId = 0;
    }

    //     
    //     this.CallerName = '';
    //     this.ContactNumber = '';
    //     this.AlternateContactNumber = '';
    //     this.Relationship = '';
    //     this.EmailId = '';
    //     this.Location = '';
    // }
}