import { Injectable } from '@angular/core';
import { URLSearchParams, Headers, Response, RequestOptions } from '@angular/http';

import { BaseModel, ResponseModel, WEB_METHOD } from '../../models';
import { ODataKeyConfig } from './odata.keyconfig';
import { GlobalConstants } from '../../constants';
import { UtilityService } from '../common.service';

@Injectable()
export class DataProcessingService {

    public Key: ODataKeyConfig = new ODataKeyConfig();
    public EndPoint: string = GlobalConstants.ODATA;

    private get BaseUri(): string {
        return `${GlobalConstants.EXTERNAL_URL}${this.EndPoint}`;
    }

    /**
     * Generate and returns API or OData uri as per the parameter provided
     *
     * @param {string} typeName 'typeName represents OData or API controller name'
     * @param {string} [entityKey] 'entityKey can be number or guid which is optional parameter'
     * @param {string} [actionSuffix] 'actionSuffix represents custom API function name which is optional parameter'
     * @returns
     *
     * @memberOf DataOperation
     */
    public GetUri(typeName: string, entityKey: string = '', actionSuffix: string = '') {
        let uri: string = '';
        console.log(`action suffix ${actionSuffix.toString()}`);

        if (this.EndPoint === GlobalConstants.TOKEN)
            uri = `${this.BaseUri}`;
        else {
            if (entityKey !== '') {
                if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(entityKey))
                    uri = `${this.BaseUri}/${typeName}/('${entityKey}')`;
                else if (!/^[0-9]*$/.test(entityKey))
                    uri = `${this.BaseUri}/${typeName}/(${entityKey})`;
                else
                    uri = `${this.BaseUri}/${typeName}/(${entityKey})`;
            }
            else {
                if (actionSuffix !== '' && typeName !== '')
                    uri = `${this.BaseUri}/${typeName}/${actionSuffix}`;
                else if (actionSuffix !== '' && typeName === '')
                    uri = `${uri}/${actionSuffix}`;
                else
                    uri = `${this.BaseUri}/${typeName}`;
            }
        }
        return uri;
    }

    /**
     * Commoin error handler
     *
     * @param {*} error
     * @param {*} caught
     *
     * @memberOf DataOperation
     */
    public HandleError(error: any, caught: any = {}): void {
        let message: string = /api$/gi.test(this.BaseUri) ? 'API Error' : 'OData Error';
        console.warn(message, error, caught);
    }

    /**
     * Set new headers or merge existing headers
     *
     * @param {Headers} headers
     * @param {URLSearchParams} [params]
     * @returns {RequestOptions}
     *
     * @memberOf DataProcessingService
     */
    public SetRequestOptions(requestType: WEB_METHOD, headers: Headers, params?: URLSearchParams): RequestOptions {
        let _headers: Headers = requestType === WEB_METHOD.GET ?
            new Headers({
                'Content-Type': 'application/json; charset=utf-8; odata.metadata=none',
                'Accept': 'application/json; charset=utf-8; odata.metadata=none'
            }) : new Headers({
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json; charset=utf-8'
            });
        console.log(_headers);
        let token: string = UtilityService.GetFromSession('access_token');
        if (token !== '') {
            _headers.append('Authorization', `Bearer ${token}`);
        }

        let requestOptions: RequestOptions = new RequestOptions({
            headers: Object.assign<Headers, Headers>(_headers, headers)
        });

        if (params) requestOptions.search = params;
        return requestOptions;
    }

    /**
     * Extract data from OData or API responses
     *
     * @template T
     * @param {Response} response
     * @returns {T}
     *
     * @memberOf DataProcessingService
     */
    public ExtractQueryResult<T extends BaseModel | any>(response: Response): T {
        if (response.status < 200 || response.status >= 300) {
            throw new Error(`Bad response status: ${response.status}`);
        }

        let responseBody = response.json();
        let entity: T | any = responseBody;
        return entity || null;
    }

    /**
     * Extract data collection from OData or API responses
     *
     * @template T
     * @param {Response} response
     * @returns {T[]}
     *
     * @memberOf DataOperation
     */
    public ExtractQueryResults<T extends BaseModel | any>(response: Response): T | any[] {
        if (response.status < 200 || response.status >= 300) {
            throw new Error(`Bad response status: ${response.status}`);
        }

        let responseBody = response.json();
        let entities: T | any[] = (responseBody.value) ?
            <T | any[]>responseBody.values : <T | any[]>responseBody;
        return entities;
    }

    /**
     * Extract data collection and total record count from OData or API response
     *
     * @template T
     * @param {Response} response
     * @returns {ResponseModel<T>}
     *
     * @memberOf DataOperation
     */
    public ExtractQueryResultsWithCount<T extends BaseModel>(response: Response): ResponseModel<T> {
        let responseModel: ResponseModel<T | any> = new ResponseModel<T | any>();

        if (response.status < 200 || response.status >= 300) {
            throw new Error(`Bad response status: ${response.status}`);
        }

        let responseBody = response.json();
        let entities: T[] | any[] = (responseBody.value) ?
            <T[] | any[]>responseBody.value : <T[] | any[]>responseBody;
        responseModel.Records = entities;

        try {
            let count: number = parseInt(responseBody['@odata.count'], 10) || entities.length;
            responseModel.Count = count;
        } catch (error) {
            console.warn('Cannot determine response entities count. Falling back to collection length...');
            responseModel.Count = entities.length;
        }

        return responseModel;
    }
}