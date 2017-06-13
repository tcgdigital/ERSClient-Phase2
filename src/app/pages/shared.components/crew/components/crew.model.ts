import { BaseModel } from '../../../../shared';
import { FlightModel, AffectedPeopleModel } from '../../../shared.components';

export class CrewModel extends BaseModel {
	public CrewId: number;
	public FlightId?: number;
	public EmployeeNumber: string;
	public CrewName: string;
	public AsgCat: string;
	public DeadheadCrew: string;
	public BaseLocation: string;
	public Email: string;
	public DepartureStationCode: string;
	public ArrivalStationCode: string;
	public FlightNo: string;
	public WorkPosition: string;
	public CrewDob?: Date;
	public CrewAddress: string;
	public CrewGender: string;
	public NextStationCode: string;
	public CrewNationality: string;
	public ContactNumber: string;
	public AlternateContactNumber: string;
	public PersonalInformationFile: string;
	public TrainingRecords: string;
	public LicenseRecords: string;

	public Age : string;
	public PassportNumber : string;
	public PassportValidity : string;
	public NOKName : string;
	public NOKContactNumber : string;
	public MedicalClearance : string;

	public Flight?: FlightModel;
	public AffectedPeople?: AffectedPeopleModel[];

	/**
	 * Creates an instance of CrewModel.
	 * 
	 * @memberOf CrewModel
	 */
	constructor() {
		super();
		this.CrewId = 0;
		this.FlightId = null;
		this.EmployeeNumber = '';
		this.CrewName = '';
		this.AsgCat = '';
		this.DeadheadCrew = '';
		this.BaseLocation = '';
		this.Email = '';
		this.DepartureStationCode = '';
		this.ArrivalStationCode = '';
		this.FlightNo = '';
		this.WorkPosition = '';
		this.CrewDob = null;
		this.CrewAddress = '';
		this.CrewGender = '';
		this.NextStationCode = '';
		this.CrewNationality = '';
		this.ContactNumber = '';
		this.AlternateContactNumber = '';
	}
}