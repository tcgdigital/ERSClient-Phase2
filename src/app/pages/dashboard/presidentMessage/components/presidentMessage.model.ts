import { BaseModel } from '../../../../shared';

export class PresidentMessageModel extends BaseModel {
    public PresidentsMessageId: number;
    public Message: string;
    public Remarks: string;
    public InitiateDepartmentId: number;
    public IncidentId: number;
    public IsUpdated: boolean;
    public IsPublished: boolean;
    public PublishedBy: number;
    public PublishedOn?: Date;

    /**
     * Creates an instance of PresidentMessageModel.
     * 
     * @memberOf PresidentMessageModel
     */
    constructor() {
        super();

        this.PresidentsMessageId = 0;
        this.IsPublished = false;
    }
}