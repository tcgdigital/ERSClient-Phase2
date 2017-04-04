import { Injectable, Output, EventEmitter } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { CallerModel } from './caller.model';
import { ICallerService } from './ICallerService';
import {    
    DataServiceFactory, ServiceBase        
} from '../../../../shared';

@Injectable()
export class CallerService extends ServiceBase<CallerModel> implements ICallerService {

    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'Callers');
    }
}