import { Injectable } from '@angular/core';
  
 import { AffectedPersonModel } from './AffectedPerson.model';
 import {
     IServiceInretface,
     ResponseModel,
     DataService,
     DataServiceFactory,
     DataProcessingService,
     ServiceBase
 
 } from '../../../shared';
 
  @Injectable()
 export class PeopleOnBoardWidgetService extends ServiceBase<AffectedPersonModel> {
 
     constructor(private dataServiceFactory: DataServiceFactory) {
         super(dataServiceFactory, 'AffectedPeople');
      }
 }
