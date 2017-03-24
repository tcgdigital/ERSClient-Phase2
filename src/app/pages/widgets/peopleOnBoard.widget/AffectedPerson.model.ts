import { BaseModel } from '../../../shared';

export class AffectedPersonModel extends BaseModel {
    public AffectedPersonId: number;
    public AffectedId: number;
    public PassengerId?: number;
    public CrewId?: number;
    public IsLost?: boolean;
    public TicketNumber: string;
    public Identification: string;
    public LostFoundStatus: string;
    public MedicalStatus: string;
    public ReunionStatus?: string;
    public Remarks: string;
    public IsStaff: boolean;
    public IsCrew: boolean;
    public IsVerified: boolean;
}