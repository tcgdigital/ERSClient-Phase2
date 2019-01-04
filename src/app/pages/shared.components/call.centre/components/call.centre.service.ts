import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { EnquiryModel, QueryModel } from './call.centre.model';
import { IEnquiryService } from './IEnquiryService';
import {
    ResponseModel,
    DataServiceFactory, DataProcessingService, DataService,
    ServiceBase, UtilityService
} from '../../../../shared';
import { AffectedPeopleModel } from '../../affected.people';
import { CareMemberTrackerModel } from '../../care.member.tracker';

@Injectable()
export class EnquiryService extends ServiceBase<EnquiryModel>
    implements IEnquiryService {
    private _bulkDataService: DataService<EnquiryModel>;
    private _careDataService: DataService<CareMemberTrackerModel>;
    /**
     * Creates an instance of DepartmentService.
     * @param {DataServiceFactory} dataServiceFactory 
     * 
     * @memberOf DepartmentService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'Enquiries');
        let option: DataProcessingService = new DataProcessingService();
        this._bulkDataService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<EnquiryModel>
            ('EnquiryBatch', '', option);

        this._careDataService = this.dataServiceFactory.CreateServiceWithOptions<CareMemberTrackerModel>('CareEngagementTracks', option);

    }

    public getOtherQueryByIncident(IncidentId: number): Observable<ResponseModel<EnquiryModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId}  and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Others'`)
            .Expand('Caller').Execute();
    }

    public getCrewQueryByIncident(IncidentId: number): Observable<ResponseModel<EnquiryModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId}  and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Crew'`)
            .Expand('Caller').Execute();
    }

    public getMediaQueryByIncident(IncidentId: number): Observable<ResponseModel<EnquiryModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq  ${IncidentId}  and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Media'`)
            .Expand('Caller').Execute();
    }

    public GetEnquiredAffectedPeopleCount(incidentId: number): Observable<number> {
        return this._dataService.Count()
            .Filter(`IncidentId eq ${incidentId} and EnquiryType eq CMS.DataModel.Enum.EnquiryType'Passenger' and AffectedPersonId ne null`)
            .Execute();
    }

    public MapQuery(enquiryModel: EnquiryModel[]): QueryModel[] {
        let otherQueryModel: QueryModel[];
        otherQueryModel = enquiryModel.map(function (enquiry) {
            let item = new QueryModel();
            item.EnquiryId = enquiry.EnquiryId;
            item.Queries = enquiry.Queries;
            item.CallerName = enquiry.Caller.FirstName + "  " + enquiry.Caller.LastName;
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

    public CreateBulk(entities: EnquiryModel[]): Observable<EnquiryModel[]> {
        return this._bulkDataService.BulkPost(entities).Execute();
    };

    public UpdateBulkToDeactivateFromExternalId(externalInputId: number): Observable<EnquiryModel[]> {
        let option = new DataProcessingService();
        let bulkDataServiceToDeactivate = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix<EnquiryModel>
            ('EnquiryBatch', `BatchDeactivate/${externalInputId}`, option);
        return bulkDataServiceToDeactivate.JsonPost(externalInputId).Execute();
    };

    public CareMemberName(incidentId: number, AffectedPersonId: number): Observable<ResponseModel<CareMemberTrackerModel>> {
        return this._careDataService.Query()
            .Filter(`AffectedPersonId eq ${AffectedPersonId} and IncidentId eq ${incidentId} and ActiveFlag eq 'Active'`)
            .Top(`1`)
            .Select(`CareMemberName`)
            .Execute();
    }
}