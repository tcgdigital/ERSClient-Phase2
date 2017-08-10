import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UtilityService } from '../common.service'

@Injectable()
/** The auth guard is used to prevent unauthenticated users from accessing restricted routes,
 * it's used in app.routing.ts to protect the home page route
 */
export class RouteGuardService implements CanActivate {
    constructor(private router: Router) { }

    public canActivate(): boolean {
         if (UtilityService.IsSessionKeyExists('CurrentIncidentId') && 
            UtilityService.GetFromSession('CurrentIncidentId')) {
            // logged in so return true
            return true;
        } else {
            // not logged in so redirect to login page
            this.router.navigate(['pages/landing']);
            return false;
        }
    }

    
}