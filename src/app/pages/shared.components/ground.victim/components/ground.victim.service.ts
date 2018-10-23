import { Injectable } from '@angular/core';
import { ServiceBase, DataServiceFactory, ResponseModel } from '../../../../shared';
import { GroundVictimModel } from './ground.victim.model';
import { Observable } from 'rxjs';
import { IGroundVictimService } from './IGroundVictimService';
import { InvolvePartyService, InvolvePartyModel } from '../../involveparties';

@Injectable()
export class GroundVictimService extends ServiceBase<GroundVictimModel>
    implements IGroundVictimService {

    constructor(private dataServiceFactory: DataServiceFactory,
        private involvedPartyService: InvolvePartyService) {
        super(dataServiceFactory, 'Mediaqueries');
    }

    public GetAllGroundVictimsByIncident(incidentId: number): Observable<GroundVictimModel> {
        return this.involvedPartyService.GetAllGroundVictimsByIncident(incidentId)
            .flatMap((involveParties) => {
                debugger;
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