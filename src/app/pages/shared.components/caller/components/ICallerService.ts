import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { CallerModel } from './caller.model';
import {
   ServiceBase,ResponseModel
} from '../../../../shared';

export interface ICallerService extends ServiceBase<CallerModel> {

}