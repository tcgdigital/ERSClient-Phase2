import { BaseModel } from '../../../shared';
import { IncidentModel } from "../../incident";
export class ArchiveReportWidgetModel extends BaseModel {

}



export class OtherReportModel extends BaseModel {
    public FilePathWithName: string;
    public Extension: string;
    public FileName: string;
    public DocumentType: string;

    constructor() {
        super();
        this.FilePathWithName = '';
        this.Extension = '';
        this.FileName = '';
        this.DocumentType = '';
    }
}

export class DepartmentClosureModel extends BaseModel {
    public DepartmentClosureId: number;
    public IncidentId: number;
    public DepartmentId: number;
    public ClosureReport: string;
    public ClosureRemark: string;
    public IsSubmitted: boolean;
    public SubmittedBy?: number;
    public SubmittedOn?: Date;
    public IsSaved: boolean;
    public SavedBy?: number;
    public SavedOn?: Date;


    constructor() {
        super();
        this.DepartmentClosureId = 0;
        this.IncidentId = 0;
        this.DepartmentId = 0;
        this.ClosureReport = '';
        this.ClosureRemark = '';
        this.IsSubmitted = false;
        this.SubmittedBy = null;
        this.SubmittedOn = null;
        this.IsSaved = false;
        this.SavedBy = null;
        this.SavedOn = null;

    }
}