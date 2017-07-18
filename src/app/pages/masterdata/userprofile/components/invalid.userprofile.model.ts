import { BaseModel } from '../../../../shared';

export class InvalidUserProfileModel extends BaseModel {
    public InvalidUserProfileId: number;
    public UserId: string;
    public Name: string;
    public Email: string;
    public Designation: string;
    public DepartmentName: string;
    public Gender: string;
    public Grade: string;
    public MainContact: string;
    public AlternateContact: string;
    public DeviceId: string;
    public RegistrationId: string;
    public DeviceOS: string;

    public EmployeeId : string;
    public Nationality : string;
    public PassportNumber : string;
    public PassportDetails : string;
    public TrainingDetails : string;
    public VisaDetails : string;
    public NOKDetails : string;

    constructor() {
        super();       
    }
}