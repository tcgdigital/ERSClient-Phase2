import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UtilityService } from '../common.service'
import { IncidentClosureIndicationService } from './incident.closure.indication.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
/** The auth guard is used to prevent unauthenticated users from accessing restricted routes,
 * it's used in app.routing.ts to protect the home page route
 */
export class RouteGuardService implements CanActivate {
    constructor(private router: Router,
        private incidentClosureIndicationService: IncidentClosureIndicationService)
    { }

    public canActivate(): Observable<boolean> {
        return this.incidentClosureIndicationService.IsAnyOpenIncidents()
            .map((x) => {
                if (!x)
                    this.router.navigate(['pages/landing']);
                return x;
            });

        //  if (UtilityService.IsSessionKeyExists('CurrentIncidentId') && 
        //     UtilityService.GetFromSession('CurrentIncidentId')) {
        //     // logged in so return true
        //     return true;
        // } else {
        //     // not logged in so redirect to login page
        //     this.router.navigate(['pages/landing']);
        //     return false;
        // }
    }
}