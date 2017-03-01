import { BaseModel } from '../../../../shared';
import { FlightModel } from '../../Flight';
 
 export class PassengerModel extends BaseModel {
 
        public  PassengerId : number;
        public  FlightId ? : number;
        public  FlightNumber : string ;
        public  PassengerName: string ;
        public  Details : string ;
        public  PassengerGender : string ;
        public  PassengerNationality: string ;
        public  SpecialServiceRequestCode : string ;
        public  BaggageCount ? : number;
        public  Destination : string;
        public  IsVip ? : boolean; 
        public  PassengerDob ? : Date;
        public Seatno   : string;
        public Passport  : string;
        public Pnr  : string;
        public SpokenLanguage  : string;
        public Religion  : string;
        public TravellingWith  : string;
        public ContactNumber : string;
        public AlternateContactNumber : string; 
        public PassengerType : string;
        public DepartureDateTime? : Date; 
        public ArrivalDateTime ? : Date;

        public Flight : FlightModel;
}