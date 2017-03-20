import { BaseModel } from '../../../../shared';

export class MediaModel extends BaseModel {
    public MediaqueryId: number;
    public Message: string;
    public Remarks: string;
    public InitiateDepartmentId: number;
    public IncidentId: number;
    public IsUpdated: boolean;
    public IsPublished: boolean;
    public PublishedBy: number;
    public PublishedOn?: Date;

    /**
     * Creates an instance of MediaQueryModel.
     * 
     * @memberOf MediaQueryModel
     */
    constructor(){
        super();

        this.MediaqueryId = 0;
        this.IsPublished = false;
    }
}