import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpInterceptorService } from '../../../interceptor';
import { BaseModel, WEB_METHOD } from '../../../models';
import { DataProcessingService, DataOperation } from '../index';
import { NameValue } from '../../../models';

/**
 * Data operation specific for JSON based PATCH request
 *
 * @export
 * @class PatchOperation
 * @extends {(DataOperation<T | any>)}
 * @template T
 */
export class PatchOperation<T extends BaseModel | any> extends DataOperation<BaseModel | any> {
    constructor(private dataProcessingService: DataProcessingService,
        private httpService: Http,
        private httpInterceptor: HttpInterceptorService,
        private typeName: string,
        private entity: T,
        private key: string,
        private additionalHeader?: NameValue<string>) {
        super(dataProcessingService, httpService, httpInterceptor, typeName, entity);
        this.Key = key;
        this.RequestHeaders = new Headers({
            'Content-Type': 'application/json; charset=utf-8; odata.metadata=none',
            'Accept': 'application/json; charset=utf-8; odata.metadata=none'
        });

        if (additionalHeader != undefined && additionalHeader != null)
            this.RequestHeaders.append(additionalHeader.Name, additionalHeader.Value);
    }

    /**
     * Execute PATCH request
     *
     * @returns {(Observable<T | any>)}
     *
     * @memberOf PatchOperation
     */
    public Execute(): Observable<T | any> {
        const body = JSON.stringify(this.entity);
        const uri: string = this.DataProcessingService
            .GetUri(this.TypeName, this.Key, this.ActionSuffix);

        const requestOps = this.DataProcessingService
            .SetRequestOptions(WEB_METHOD.PATCH, this.RequestHeaders);

        return super.HandleResponse(this.HttpService.patch(uri, body, requestOps));
    }
}
