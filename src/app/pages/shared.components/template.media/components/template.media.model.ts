import { BaseModel } from '../../../../shared/models/base.model';

export class TemplateMediaModel extends BaseModel {
    public TemplateMediaId : number;
    public TemplateMediaName : string;
    public TemplateType : string;
    public TemplateContent : string;
    public TemplateSubject : string;
    public TemplatePurpose : string;
    public ExportTemplatePath : string;
}