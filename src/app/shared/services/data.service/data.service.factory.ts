import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { BaseModel } from '../../models';
import { DataProcessingService } from './data.processing.service';
import { DataService } from './data.service';

/**
 * DataServiceFactory to create an instance of DataService
 *
 * @export
 * @class DataServiceFactory
 */
@Injectable()
export class DataServiceFactory {
    constructor(private http: Http, private dataProcessingService: DataProcessingService) {
    }

    /**
     * Create an instance of a DataService
     *
     * @template T
     * @param {string} typeName
     * @param {(err: any) => any} [handleError]
     * @returns {DataService<T>}
     *
     * @memberOf DataServiceFactory
     */
    public CreateService<T extends BaseModel>
        (typeName: string, handleError?: (err: any) => any): DataService<T> {
        return new DataService<T>(typeName, this.http, this.dataProcessingService);
    }

    /**
     * Create an instance of a DataService with opetions
     *
     * @template T
     * @param {string} typeName
     * @param {DataProcessingService} dataProcessingService
     * @returns {DataService<T>}
     *
     * @memberOf DataServiceFactory
     */
    public CreateServiceWithOptions<T extends BaseModel>
        (typeName: string, dataProcessingService: DataProcessingService): DataService<T> {
        return new DataService<T>(typeName, this.http, dataProcessingService);
    }

    /**
     * Create an instance of a DataService with options and avtion suffix
     *
     * @template T
     * @param {string} typeName
     * @param {string} actionSuffix
     * @param {DataProcessingService} dataProcessingService
     * @returns {DataService<T>}
     *
     * @memberOf DataServiceFactory
     */
    public CreateServiceWithOptionsAndActionSuffix<T extends BaseModel>
        (typeName: string, actionSuffix: string, dataProcessingService: DataProcessingService): DataService<T> {
        return new DataService<T>(typeName, this.http, dataProcessingService, actionSuffix);
    }

    /**
     * Create an instance of a DataService with options and exception handler delegate
     *
     * @template T
     * @param {DataProcessingService} dataProcessingService
     * @param {(err: any) => any} [handleError]
     * @returns {DataService<T>}
     *
     * @memberOf DataServiceFactory
     */
    public CreateServiceWithOptionsAndErrorHandler<T extends BaseModel>
        (dataProcessingService: DataProcessingService, handleError?: (err: any) => any): DataService<T> {
        return new DataService<T>('', this.http, dataProcessingService);
    }
}