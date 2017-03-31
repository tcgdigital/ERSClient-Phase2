import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { EnquiryModel, QueryModel } from './call.centre.model';
import {
    RequestModel,
    ResponseModel,
    BaseModel,
    WEB_METHOD,
    DataProcessingService,
    DataService,
    DataServiceFactory,
    GlobalConstants,
    IServiceInretface
} from '../../../../shared';

@Injectable()
export class EnquiryService implements IServiceInretface<EnquiryModel> {
    private _dataService: DataService<EnquiryModel>;
    // private _batchDataService: DataService<BaseModel>;

    /**
     * Creates an instance of DepartmentService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf DepartmentService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        let option: DataProcessingService = new DataProcessingService();
        this._dataService = this.dataServiceFactory
            .CreateServiceWithOptions<EnquiryModel>('Enquiries', option);
    }

    GetAll(): Observable<ResponseModel<EnquiryModel>> {
        return this._dataService.Query()
            .Execute();
    }

    Get(id: string | number): Observable<EnquiryModel> {
        return this._dataService.Get(id.toString()).Execute();
    }

    Create(entity: EnquiryModel): Observable<EnquiryModel> {
        return this._dataService.Post(entity).Execute();
    }

    CreateBulk(entities: EnquiryModel[]): Observable<EnquiryModel[]> {
        return Observable.of(entities);
    }

    Update(entity: EnquiryModel): Observable<EnquiryModel> {
        return Observable.of(entity);
    }

    Delete(entity: EnquiryModel): void {
    }

    getOtherQueryByIncident(IncidentId: string | number): Observable<ResponseModel<EnquiryModel>> {
        return this._dataService.Query().Filter(`IncidentId eq  ${IncidentId}  and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Others'`)
            .Expand('Caller')
            .Execute();
    }

    getCrewQueryByIncident(IncidentId: string | number): Observable<ResponseModel<EnquiryModel>> {
        return this._dataService.Query().Filter(`IncidentId eq  ${IncidentId}  and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Crew'`)
            .Expand('Caller')
            .Execute();
    }
    getMediaQueryByIncident(IncidentId: string | number): Observable<ResponseModel<EnquiryModel>> {
        return this._dataService.Query().Filter(`IncidentId eq  ${IncidentId}  and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Media'`)
            .Expand('Caller')
            .Execute();
    }

    MapQuery(enquiryModel: EnquiryModel[]): QueryModel[] {
        let otherQueryModel: QueryModel[];
        otherQueryModel = enquiryModel.map(function (enquiry) {
            let item = new QueryModel();
            item.EnquiryId = enquiry.EnquiryId;
            item.Queries = enquiry.Queries;
            item.CallerName = enquiry.Caller.CallerName;
            item.ContactNumber = enquiry.Caller.ContactNumber;
            item.AlternateContactNumber = enquiry.Caller.AlternateContactNumber;
            return item;
        });
        return otherQueryModel;

    }

    GetEnquiredAffectedPeopleCount(incidentId: string | number): Observable<number> {
        return this._dataService.Count()
            .Filter(`IncidentId eq ${incidentId} and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Passenger' and AffectedPersonId ne null`)
            .Execute();
    }

    GetEnquiredAffectedCrewCount(incidentId: string | number): Observable<number> {
        return this._dataService.Count()
            .Filter(`IncidentId eq ${incidentId} and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Crew' and AffectedPersonId ne null`)
            .Execute();
    }
}