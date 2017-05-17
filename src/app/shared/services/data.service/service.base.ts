
import { Observable } from 'rxjs/Rx';
import { BaseModel, ResponseModel } from '../../models';
import { IServiceInretface } from './service.interface';
import { DataService } from './data.service'
import { DataServiceFactory } from './data.service.factory';
import { DataProcessingService } from './data.processing.service';

export abstract class ServiceBase<T extends BaseModel> implements IServiceInretface<T>  {
    protected _dataService: DataService<T>;

    /**
     * Creates an instance of ServiceBase.
     * @param {DataServiceFactory} dataServiceFactory 
     * @param {string} entityType 
     * @param {DataProcessingService} [option] 
     * 
     * @memberOf ServiceBase
     */
    constructor(dataServiceFactory: DataServiceFactory, entityType: string, option?: DataProcessingService) {
        option = (option) ? option : new DataProcessingService();
        this._dataService = dataServiceFactory
            .CreateServiceWithOptions<T>(entityType, option);
    }

    public GetAll(): Observable<ResponseModel<T>> {
        return this._dataService.Query().Execute();
    }

    public Get(id: string | number): Observable<T> {
        return this._dataService.Get(id.toString()).Execute();
    }

    public Create(entity: T): Observable<T> {
        return this._dataService.Post(entity).Execute();
    }

    public CreateBulk(entities: T[]): Observable<T[]> {
        return this._dataService.BulkPost(entities).Execute();
    }

    public Update(entity: T, key?: number): Observable<T> {
        key = (key) ? key : entity[Object.keys(entity)[0]].toString();
        return this._dataService.Patch(entity, key.toString()).Execute();
    }

    public Delete(entity: T, key?: number): Observable<T> {
        key = (key) ? key : entity[Object.keys(entity)[0]].toString();
        return this._dataService.Delete(key.toString()).Execute();
    }
}