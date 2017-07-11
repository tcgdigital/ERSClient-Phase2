import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { DemandTrailModel } from './demand.trail.model';
import { DemandModel } from './demand.model';
import {
    ServiceBase, ResponseModel
} from '../../../../shared';

export interface IDemandTrailService extends ServiceBase<DemandTrailModel> {
    getDemandTrailByDemandId(demandId): Observable<ResponseModel<DemandTrailModel>>;
}