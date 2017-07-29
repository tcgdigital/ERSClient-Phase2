import { BaseModel } from '../../../../shared';
import { FlightModel } from '../../flights';

export class InvalidPassengerModel extends BaseModel{
    public InvalidPassengerId : number;
    public FlightId? : number;
    public FlightNumber : string;
    public PassengerName : string;
    public SpecialServiceRequestCode : string;
    public BaggageCount : string;
    public Seatno : string;
    public Pnr : string;
    public ErrorReason : string;

    public  PassengerGender : string;
    public  PassengerNationality : string;
    public  Origin : string;
    public  Destination : string;
    public  IsVip : string;
    public  PassengerDob : string;
    public  Passport : string;
    public  ContactNumber : string;
    public  AlternateContactNumber : string;
    public  PassengerType : string;

    public  IdentificationDocType : string;
    public  IdentificationDocNumber : string;
    public  InboundFlightNumber : string;
    public  OutBoundFlightNumber : string;
    public  EmployeeId : string;
    public  BaggageWeight : string;

    public Flight : FlightModel;
}