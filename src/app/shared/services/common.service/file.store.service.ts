import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { FileStoreModel } from '../../models/file.store.model'

import {    
    DataServiceFactory,
    ServiceBase
} from '../data.service';


@Injectable()
export class FileStoreService  extends ServiceBase<FileStoreModel> {

    /**
     * Creates an instance of FileStoreService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf FileStoreService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'FileStores');
    }
}