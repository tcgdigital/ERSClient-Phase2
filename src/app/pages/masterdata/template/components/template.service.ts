import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { TemplateModel } from './template.model';
import { ITemplateService } from './ITemplateService';
import {
    ResponseModel,
    DataServiceFactory,
    ServiceBase
} from '../../../../shared';

@Injectable()
export class TemplateService
    extends ServiceBase<TemplateModel>
    implements ITemplateService {

    /**
     * Creates an instance of TemplateService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf TemplateService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'Templates');
    }

    GetAll(): Observable<ResponseModel<TemplateModel>> {
        let templates: ResponseModel<TemplateModel>;
        return this._dataService.Query()
            .Expand("EmergencySituation")
            .OrderBy("CreatedOn desc")
            .Execute().map((data: ResponseModel<TemplateModel>) => {
                templates = data;
                templates.Records.forEach(x => x.Active = (x.ActiveFlag == 'Active'));
                return templates;
            });
    }

    GeAllEmailTemplates(): Observable<ResponseModel<TemplateModel>> {
        let templates: ResponseModel<TemplateModel>;
        return this._dataService.Query()
            .Filter(`TemplateMediaId eq CMS.DataModel.Enum.TemplateMediaType'Email'`)
            .Expand("EmergencySituation")
            .OrderBy("CreatedOn desc")
            .Execute().map((data: ResponseModel<TemplateModel>) => {
                templates = data;
                templates.Records.forEach(x => x.Active = (x.ActiveFlag == 'Active'));
                return templates;
            });
    }   

    GetQuery(query: string): Observable<ResponseModel<TemplateModel>> {
        return this._dataService.Query()
            .Expand('EmergencySituation')
            .Filter(query).Execute();
    }

    GetByEmergencySituationId(emergencySituationId:number):Observable<ResponseModel<TemplateModel>>{
        return this._dataService.Query()
        .Filter(`EmergencySituationId eq ${emergencySituationId}`)
        .Execute();
    }
}