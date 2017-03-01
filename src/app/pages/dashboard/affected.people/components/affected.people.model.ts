import { BaseModel } from '../../../../shared';
import { PassengerModel } from '../../passenger';
import { CrewModel } from '../../crew';
 
 export class AffectedPeopleModel extends BaseModel {
        public  AffectedPersonId : number;
        public  AffectedId : number;
        public  PassengerId : number;
        public  CrewId : number;
        public  IsLost : boolean;
        public  TicketNumber : string;
        public  Identification : string;
        public  LostFoundStatus : string;
        public  MedicalStatus : string;
        public  ReunionStatus : boolean; 
        public  Remarks : string;
        public  IsStaff : boolean;
        public  IsCrew : boolean;
        public  IsVerified : boolean;

        public Passenger ? : PassengerModel;
        public Crew ? : CrewModel;
}

export class AffectedPeopleToView extends BaseModel{
        public  AffectedId: number;
           public AffectedPersonId: number;
               public  PassengerName : string;
               public  Pnr:string;
               public  CrewName: string;
               public  CrewNameWithCategory: string;
               public  ContactNumber: string;
               public  TicketNumber: string;
               public  IsVerified: boolean;
               public  IsCrew: boolean;
               public  IsStaff: boolean;
               public  MedicalStatus : string;
               public  Remarks: string;
               public  Identification: string;
               public  SeatNo: string;
              // public  CommunicationLogs: dataItem.CommunicationLogs,
               public   PaxType: string;

}
