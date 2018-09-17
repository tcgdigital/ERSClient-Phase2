import { BaseModel } from '../../../shared';
import { CallerModel } from "../../shared.components/caller";
import { IncidentModel } from "../../incident/components";
import { EnquiryModel } from "../../shared.components/call.centre";
import { AffectedPeopleModel } from "../../shared.components/affected.people/components";

export class ExternalInputModel extends BaseModel {
    public ExternalInputId: number;
    public EnquiryType: string;
    public CallerId?: number;
    public MediaAndOtherQueriesId?: number;
    public PDAEnquiryId?: number;
    public CargoEnquiryId?: number;
    public GroundVictimEnquiryId?: number;
    public IsCallRecieved: boolean;
    public IncidentId: number;

    public Caller?: CallerModel;
    public CargoEnquiry?: CargoEnquiryModel;
    public MediaAndOtherQuery?: MediaAndOtherQueryModel;
    public GroundVictimEnquiry?: GroundVictimQueryModel;
    public PDAEnquiry?: PDAEnquiryModel;
    public Incident?: IncidentModel;
    public Enquiries?: EnquiryModel[];

    constructor() {
        super();
    }
}

export class PDAEnquiryModel extends BaseModel {
    public PDAEnquiryId: number;
    public LastName: string;
    public FirstName: string;
    public Age: number;
    public Nationality: string;
    public PermanentAddress: string;
    public FlightNumber: string;
    public DepartedFrom: string;
    public TravellingTo: string;
    public TravellingWith: string;
    public EnquiryReason: string;
    public KINFirstName: string;
    public KINLastName: string;
    public KINContactNumber: string;
    public KINRelationShip: string;
    public Query: string;
    public IncidentId: number;
    public FinalDestination: string;
    public AffectedPersonId: number;

    public Incident?: IncidentModel;
    public AffectedPerson?: AffectedPeopleModel;
    public ExternalInputs: ExternalInputModel[];

    constructor() {
        super();
    }
}

export class CargoEnquiryModel extends BaseModel {
    public CargoEnquiryId: number;
    public ShippersName: string;
    public ShippersAddress: string;
    public ShippersContactNumber: string;
    public ConsigneesName: string;
    public ConsigneesAddress: string;
    public ConsigneesContactNumber: string;
    public EnquiryReason: string;
    public Query: string;
    public IncidentId: number;

    public Incident?: IncidentModel;
    public ExternalInputs: ExternalInputModel[];

    constructor() {
        super();
    }
}

export class MediaAndOtherQueryModel extends BaseModel {
    public MediaAndOtherQueriesId: number;
    public source: string;
    public Query: string;
    public IncidentId: number;

    public Incident?: IncidentModel;
    public ExternalInputs: ExternalInputModel[];

    constructor() {
        super();
    }
}

export class GroundVictimQueryModel extends BaseModel {
    public GroundVictimQueriesId: number;
    public VictimName: string;
    public VictimAddress: string;
    public VictimContactNumber: string;
    public Query: string;
    public IncidentId: number;

    public Incident?: IncidentModel;
    public ExternalInputs: ExternalInputModel[];

    constructor() {
        super();
    }
}