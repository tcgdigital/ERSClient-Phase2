import { BaseModel } from '../../../../shared';
import {
	AffectedModel,
	PassengerModel,
	CrewModel,
	NextOfKinModel,
	EnquiryModel,
	CommunicationLogModel,
	DemandModel
} from '../../../shared.components';
 import { PDAEnquiryModel } from "../../../callcenteronlypage";

export class AffectedPeopleModel extends BaseModel {
	public AffectedPersonId: number;
	public AffectedId: number;
	public PassengerId?: number;
	public CrewId?: number;
	public IsLost?: boolean;
	public TicketNumber: string;
	public Identification: string;
	public LostFoundStatus: string;
	public MedicalStatus: string;
	public ReunionStatus?: boolean;
	public Remarks: string;
	public IsStaff: boolean;
	public IsCrew: boolean;
	public IsVerified: boolean;
	public IsNokInformed: boolean;

	public Affected: AffectedModel;
	public Passenger?: PassengerModel;
	public Crew?: CrewModel;


	public NextOfKins?: NextOfKinModel[];
	public Enquiries?: EnquiryModel[];
	public PDAEnquiries?: PDAEnquiryModel[];
	public CommunicationLogs?: CommunicationLogModel[];
	public Demands?: DemandModel[];

	constructor( initialize ? : boolean) {		
		if(initialize){
			super();
		this.AffectedPersonId = 0;
		this.AffectedId = 0;
		this.PassengerId = null;
		this.CrewId = null;
		this.IsLost = null;
		this.TicketNumber = '';
		this.Identification = '';
		this.LostFoundStatus = '';
		this.MedicalStatus = '';
		this.ReunionStatus = null;
		this.Remarks = '';
		this.IsStaff = false;
		this.IsCrew = false;
		this.IsVerified = false;
		}
	}
}

export class AffectedPeopleToView extends BaseModel {
	public AffectedId: number;
	public AffectedPersonId: number;
	public PassengerName: string;
	public Pnr: string;
	public CrewName: string;
	public CrewNameWithCategory: string;
	public ContactNumber: string;
	public TicketNumber: string;
	public IsVerified: boolean;
	public IsCrew: boolean;
	public IsStaff: boolean;
	public MedicalStatus: string;
	public Remarks: string;
	public Identification: string;
	public SeatNo: string;
	public Gender: string;
	public Nationality: string;
	public Age: string;
	// public  CommunicationLogs: dataItem.CommunicationLogs,
	public PaxType: string;
	public BaggageCount?: number; 
	public BaggageWeight : number;
	public PassengerEmployeeId : string;
	public CrewIdCode : string;
	public PassengerSpecialServiceRequestCode: string;
	public CoTravellerInformation: string;
	public PassengerId?: number;
	public CrewId?: number;
	public IsNokInformed: boolean;
	public Crew?: CrewModel;
	public IsSelected: boolean;
	public GroupId: number;
	public commlength : boolean;
}

