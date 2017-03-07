import { BaseModel } from '../../../../shared';
import { CargoModel } from '../../cargo';

export class AffectedObjectModel extends BaseModel {
        public AffectedObjectId: number;
        public AffectedId: number;
        public CargoId?: number;
        public TicketNumber: string;
        public AWB: string;
        public ObjectDesc: string;
        public IsVerified: boolean;
        public IsLostFlag: boolean;
        public IsFoundFlag: boolean;
        public IdentificationDesc: string;
        public LostFoundStatus: string;

        public Cargo?: CargoModel;


}

export class AffectedObjectsToView extends BaseModel {
     public   AffectedId : number;
     public   AffectedObjectId: number;
     public   TicketNumber: string;
     public   CargoId: number;
     public   AWB: string;
     public   POL: string;
     public   POU: string;
     public   mftpcs: number;
     public   mftwgt: number;
     public   IsVerified: boolean;
     public   Details:string;
  //   public   CommunicationLogs: data.CommunicationLogs

}