import { BaseModel } from '../../../../shared';
import { FlightModel } from '../../../shared.components';

export class PassengerModel extends BaseModel {
	public PassengerId: number;
	public FlightId?: number;
	public FlightNumber: string; //m
	public PassengerName: string; //m
	public Details: string;
	public PassengerGender: string; //m
	public PassengerNationality: string; //m
	public SpecialServiceRequestCode: string;
	public BaggageCount?: number;
	public Destination: string; //m
	public IsVip?: boolean; //m
	public PassengerDob?: Date;
	public Seatno: string; //m
	public Passport: string;
	public Pnr: string; //m
	public SpokenLanguage: string;
	public Religion: string;
	public TravellingWith: string;
	public ContactNumber: string; //m
	public AlternateContactNumber: string;
	public PassengerType: string; //m
	public DepartureDateTime?: Date;
	public ArrivalDateTime?: Date;

	public Flight: FlightModel;
	public CoPassengerMappings: CoPassengerMappingModel[];

	public Origin: string;
	public IdentificationDocType: string;
	public IdentificationDocNumber: string;
	public InboundFlightNumber: string;
	public OutBoundFlightNumber: string;
	public EmployeeId: string;
	public BaggageWeight: number;

	/**
	 * Creates an instance of PassengerModel.
	 * 
	 * @memberOf PassengerModel
	 */
	constructor() {
		super();
	}
}

export class CoPassengerMappingModel extends BaseModel {
	public CoPassengerMappingId: number;
	public PassengerId: number;
	public GroupId: number;

	public Passenger?: PassengerModel;

	constructor() {
		super();
	}
}

export class CoPassangerModelsGroupIdsModel extends BaseModel  {
	public copassangers : CoPassengerMappingModel[];
	public groupIds : number[];
}
