import { Observable } from 'rxjs/Rx';
import { TemplateModel } from './template.model';
import { ResponseModel, IServiceInretface } from '../../../../shared';

export interface ITemplateService extends IServiceInretface<TemplateModel> {
    GetQuery(query: string): Observable<ResponseModel<TemplateModel>>;
}