import { Injectable } from '@angular/core';
import {
    ServiceBase, DataServiceFactory, ResponseModel,
    DataProcessingService, DataService
} from '../../../../shared';
import { CareMemberTrackerModel } from './care.member.tracker.model';
import { ICareMemberTrackerService } from './ICareMemberTrackerService';
import { Observable } from 'rxjs';


@Injectable()
export class CareMemberTrackerService extends ServiceBase<CareMemberTrackerModel>
    implements ICareMemberTrackerService {

    private _bulkCareMemberService: DataService<CareMemberTrackerModel>;

    /**
     *Creates an instance of CareMemberTrackerService.
     * @param {DataServiceFactory} dataServiceFactory
     * @memberof CareMemberTrackerService
     */
    constructor(private dataServiceFactory: DataServiceFactory) {
        super(dataServiceFactory, 'CareEngagementTracks');

        const option: DataProcessingService = new DataProcessingService();

        // this._bulkCareMemberService = this.dataServiceFactory
        //     .CreateServiceWithOptionsAndActionSuffix<CareMemberTrackerModel>
        //     ('CareMemberBatch', 'InsertCareMemberBulk', option);

        this._bulkCareMemberService = this.dataServiceFactory
            .CreateServiceWithOptions<CareMemberTrackerModel>('CareMemberBatch/InsertCareMemberBulk', option);
    }

    /**
     * Get Care Members By Affected PersonId and Current IncidentId
     *
     * @param {number} incidentId
     * @param {number} affectedPersonId
     * @returns {Observable<ResponseModel<CareMemberTrackerModel>>}
     * @memberof CareMemberTrackerService
     */
    GetCareMembersByAffectedPersonId(incidentId: number, affectedPersonId: number)
        : Observable<ResponseModel<CareMemberTrackerModel>> {
        return this._dataService.Query()
            .Filter(`IncidentId eq ${incidentId} and AffectedPersonId eq ${affectedPersonId} and ActiveFlag eq CMS.DataModel.Enum.ActiveFlag'Active'`)
            .Expand(`UserProfile($select=Name),Department($select=DepartmentName)`)
            .Select(`CareEngagementTrackId,CareMemberName,EffectedFrom,IncidentId,AffectedPersonId`)
            .OrderBy(`EffectedFrom desc`)
            .Execute();
    }

    GetCareMembersById(careMemberId: number): Observable<ResponseModel<CareMemberTrackerModel>> {
        return this._dataService.Query()
            .Filter(`CareEngagementTrackId eq ${careMemberId}`)
            .Expand(`UserProfile($select=Name), Department($select=DepartmentName)`)
            .Select(`CareEngagementTrackId, CareMemberName, EffectedFrom, IncidentId, AffectedPersonId`)
            .OrderBy(`EffectedFrom desc`)
            .Execute();
    }

    CreateBulkCareMember(departmentId: number, entities: CareMemberTrackerModel[]): Observable<CareMemberTrackerModel[]> {
        // return this._bulkCareMemberService
        //     .BulkPost(entities)
        //     .Execute();
        console.log(this._bulkCareMemberService.TypeName);
        let additionalParam = `${this._bulkCareMemberService.TypeName}/${departmentId}`
        return this._bulkCareMemberService.BulkPostWithAdditionalParam(entities, additionalParam).Execute();
    }
}