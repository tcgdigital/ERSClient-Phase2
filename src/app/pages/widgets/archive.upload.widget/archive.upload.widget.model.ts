import { BaseModel } from '../../../shared';
import { IncidentModel } from "../../incident";

export class ArchiveDocumentTypeModel extends BaseModel {
    public ArchieveDocumentTypeId: number;
    public DocumentType: string;
    public IncidentId: number;
    public DocumentUploadPath: string;

    public Incident?: IncidentModel[];

    constructor() {
        super();
        this.ArchieveDocumentTypeId = 0;
        this.DocumentType = '';
        this.IncidentId = 0;
        this.DocumentUploadPath = '';
    }
}