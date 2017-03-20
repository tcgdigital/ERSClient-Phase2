import { Injectable } from '@angular/core';

import { PeopleOnBoardModel } from './peopleOnBoard.widget.model';
import {
    IServiceInretface,
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService,
    ServiceBase

} from '../../../shared';

@Injectable()
export class PeopleOnBoardWidgetService extends ServiceBase<PeopleOnBoardModel> {

    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'AffectedPeople');
     }


}