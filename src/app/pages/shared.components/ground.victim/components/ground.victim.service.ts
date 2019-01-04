import { Injectable } from '@angular/core';
import { ServiceBase, DataServiceFactory, ResponseModel, DataProcessingService, DataService, NameValue } from '../../../../shared';
import { GroundVictimModel } from './ground.victim.model';
import { Observable } from 'rxjs';
import { IGroundVictimService } from './IGroundVictimService';
import { InvolvePartyService, InvolvePartyModel } from '../../involveparties';

@Injectable()
export class GroundVictimService extends ServiceBase<GroundVictimModel>
    implements IGroundVictimService {
    private _bulkDataService: DataService<GroundVictimModel>;

    constructor(private dataServiceFactory: DataServiceFactory,
        private involvedPartyService: InvolvePartyService) {
        super(dataServiceFactory, 'Mediaqueries');
        let option: DataProcessingService = new DataProcessingService();
        this._bulkDataService = this.dataServiceFactory
            .CreateServiceWithOptions<GroundVictimModel>('GroundVictims', option);
    }

    public GetAllGroundVictim(GroundVictimId: number): Observable<ResponseModel<GroundVictimModel>> {
        return this._bulkDataService.Query()
            .Filter(`GroundVictimId eq ${GroundVictimId}`)
            .Execute();
    }

    public UpdateGroundVictim(entity: GroundVictimModel, key?: number): Observable<GroundVictimModel> {
        return this._bulkDataService.Patch(entity, key.toString()).Execute();
    }

    public GetAllGroundVictimsByIncident(incidentId: number): Observable<GroundVictimModel> {
        return this.involvedPartyService.GetAllGroundVictimsByIncident(incidentId)
            .flatMap((involveParties) => {
                let response = involveParties.Records.map(x => x.GroundVictims);
                let victims = ([] as GroundVictimModel[]).concat(...response);
                if (victims.length > 0 && involveParties.Records[0].Affecteds.length > 0) {
                    victims.forEach(victim => {
                        victim.InvolvedParty = new InvolvePartyModel();
                        victim.InvolvedParty.Affecteds = involveParties.Records[0].Affecteds;
                    })
                }
                return victims;
            });
    }
}