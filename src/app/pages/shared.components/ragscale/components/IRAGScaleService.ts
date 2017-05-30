
import { Observable } from 'rxjs/Rx';
import { RAGScaleModel } from './ragscale.model';
import { IServiceInretface, ResponseModel } from '../../../../shared';

export interface IRAGScaleService extends IServiceInretface<RAGScaleModel> {

    GetAllActive(): Observable<ResponseModel<RAGScaleModel>>;

    GetAllActiveByAppliedModule(appliedModule:string): Observable<ResponseModel<RAGScaleModel>>;
}