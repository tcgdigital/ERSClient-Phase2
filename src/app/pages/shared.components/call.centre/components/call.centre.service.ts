import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { EnquiryModel, QueryModel } from './call.centre.model';
import { IEnquiryService } from './IEnquiryService';
import {
    ResponseModel,
    DataServiceFactory,
    ServiceBase, UtilityService
} from '../../../../shared';

@Injectable()
export class EnquiryService extends ServiceBase<EnquiryModel>
    implements IEnquiryService {

    /**
     * Creates an instance of DepartmentService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf DepartmentService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'Enquiries');
    }

    public getOtherQueryByIncident(IncidentId: number): Observable<ResponseModel<EnquiryModel>> {
        return this._dataService.Query().Filter(`IncidentId eq  ${IncidentId}  and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Others'`)
            .Expand('Caller').Execute();
    }

    public getCrewQueryByIncident(IncidentId: number): Observable<ResponseModel<EnquiryModel>> {
        return this._dataService.Query().Filter(`IncidentId eq  ${IncidentId}  and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Crew'`)
            .Expand('Caller').Execute();
    }

    public getMediaQueryByIncident(IncidentId: number): Observable<ResponseModel<EnquiryModel>> {
        return this._dataService.Query().Filter(`IncidentId eq  ${IncidentId}  and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Media'`)
            .Expand('Caller').Execute();
    }

    public GetEnquiredAffectedPeopleCount(incidentId: number): Observable<number> {
        return this._dataService.Count()
            .Filter(`IncidentId eq ${incidentId} and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Passenger' and AffectedPersonId ne null`).Execute();
    }

    public MapQuery(enquiryModel: EnquiryModel[]): QueryModel[] {
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

    GetEnquiredAffectedCrewCount(incidentId: number): Observable<number> {
        return this._dataService.Count()
            .Filter(`IncidentId eq ${incidentId} and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Crew' and AffectedPersonId ne null`)
            .Execute();
    }


    GetEnquiredAffectedPeople(incidentId: number): Observable<ResponseModel<EnquiryModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq ${incidentId} and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Passenger' and AffectedPersonId ne null`)
            .Select(`AffectedPersonId`)
            .Execute()
            .map((enquiryModelList: ResponseModel<EnquiryModel>) => {
                let affectedEnquiredPeopleIds: number[] = [];
                enquiryModelList.Records.forEach((item: EnquiryModel) => {
                    affectedEnquiredPeopleIds.push(UtilityService.pluck(item, ['AffectedPersonId'])[0]);
                });
                return enquiryModelList;
            });
    }

    GetEnquiredAffectedCrew(incidentId: number): Observable<ResponseModel<EnquiryModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq ${incidentId} and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Crew' and AffectedPersonId ne null`)
            .Select(`AffectedPersonId`)
            .Execute()
            .map((enquiryModelList: ResponseModel<EnquiryModel>) => {
                let affectedEnquiredPeopleIds: number[] = [];
                enquiryModelList.Records.forEach((item: EnquiryModel) => {
                    affectedEnquiredPeopleIds.push(UtilityService.pluck(item, ['AffectedPersonId'])[0]);
                });
                return enquiryModelList;
            });
    }
}