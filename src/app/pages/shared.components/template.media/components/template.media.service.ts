import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import {
    ResponseModel,
    DataServiceFactory,
    ServiceBase
} from '../../../../shared';

import { TemplateMediaModel } from './template.media.model'

@Injectable()
export class TemplateMediaService
    extends ServiceBase<TemplateMediaModel>{
        constructor(dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'TemplateMedias');
    }
}

