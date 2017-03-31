import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AffectedPeopleModel, AffectedPeopleService } from '../../shared.components/affected.people';
import { EnquiryService } from '../../shared.components/call.centre';
import { PeopleOnBoardModel } from './peopleOnBoard.widget.model';
import {
    IServiceInretface,
    ResponseModel,
    DataService,
    DataServiceFactory,
    DataProcessingService,
    ServiceBase

} from '../../../shared';

@Injectable()
export class PeopleOnBoardWidgetService implements OnInit {

    peopleOnBoard: PeopleOnBoardModel = null;

    constructor(private dataServiceFactory: DataServiceFactory,
        private affectedPeopleService: AffectedPeopleService,
        private enquiryService: EnquiryService) {

    }
    ngOnInit() {
        this.peopleOnBoard = new PeopleOnBoardModel();
    }

    GetPeopleOnBoardDataCount(incidentId: string | number): Observable<PeopleOnBoardModel> {
        this.peopleOnBoard = new PeopleOnBoardModel();

        return this.affectedPeopleService.GetAffectedPeopleCount(incidentId)
            .map((dataTotalAffectedPassengerCount: number) => {
                this.peopleOnBoard.totalAffectedPassengerCount = isNaN(dataTotalAffectedPassengerCount) ? 0 : dataTotalAffectedPassengerCount;
                return this.peopleOnBoard;
            })
            .flatMap((peopleOnBoard: PeopleOnBoardModel) => this.affectedPeopleService.GetAffectedCrewCount(incidentId))
            .map((dataTotalAffectedCrewCount: number) => {
                this.peopleOnBoard.totalAffectedCrewCount = isNaN(dataTotalAffectedCrewCount) ? 0 : dataTotalAffectedCrewCount;
                return this.peopleOnBoard;
            })
            .flatMap((peopleOnBoard: PeopleOnBoardModel) => this.enquiryService.GetEnquiredAffectedPeopleCount(incidentId))
            .map((dataEnquiredAffectedPassengerCount: number) => {
                this.peopleOnBoard.enquiredAffectedPassengerCount = isNaN(dataEnquiredAffectedPassengerCount) ? 0 : dataEnquiredAffectedPassengerCount;
                return this.peopleOnBoard;
            })
            .flatMap((peopleOnBoard: PeopleOnBoardModel) => this.enquiryService.GetEnquiredAffectedCrewCount(incidentId))
            .map((dataEnquiredAffectedCrewCount: number) => {
                this.peopleOnBoard.enquiredAffectedCrewCount = isNaN(dataEnquiredAffectedCrewCount) ? 0 : dataEnquiredAffectedCrewCount;
                return this.peopleOnBoard;
            });

    }
}
