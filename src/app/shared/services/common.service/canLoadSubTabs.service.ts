import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { FileStoreModel } from '../../models/file.store.model'

import {    
    DataServiceFactory,
    ServiceBase
} from '../data.service';

@Injectable()
export class CanLoadSubTabs implements CanLoad {
    constructor() {}
   
    canLoad(route: Route): Observable<boolean>|Promise<boolean>|boolean {
      //debugger;//return this.permissions.canLoadChildren(this.currentUser, route);
      return false;
    }
  }