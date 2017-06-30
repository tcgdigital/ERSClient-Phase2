import { BaseModel } from '../../../../shared';
import {
        AffectedModel,
        EnquiryModel,
        CommunicationLogModel,
        CargoModel,
        DemandModel
} from '../../../shared.components';

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
        public Remarks : string;

        public Active: boolean;

        public Affected?: AffectedModel;
        public Cargo?: CargoModel;

        public Enquiries?: EnquiryModel[];
        public CommunicationLogs?: CommunicationLogModel[];
        public Demands?: DemandModel[];

        constructor() {
                super();
        }
}

export class AffectedObjectsToView extends BaseModel {
        public AffectedId: number;
        public AffectedObjectId: number;
        public TicketNumber: string;
        public CargoId: number;
        public AWB: string;
        public POL: string;
        public POU: string;
        public mftpcs: number;
        public mftwgt: number;
        public IsVerified: boolean;
        public Details: string;
        public LostFoundStatus : string;
        public ShipperName : string;
	public ShipperAddress : string;
	public ShipperContactNo : string;
	public ConsigneeName : string;
	public ConsigneeAddress : string;
	public ConsigneeContactNo : string;
        public Remarks : string;
        public IdentificationDesc : string;
        public CargoType : string;
        public commlength : boolean;

        //   public   CommunicationLogs: data.CommunicationLogs

}