import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild } from '@angular/router';
import { UtilityService } from '../common.service'

@Injectable()
/** The auth guard is used to prevent unauthenticated users from accessing restricted routes,
 * it's used in app.routing.ts to protect the home page route
 */
export class AuthGuardService implements CanActivate, CanActivateChild {
    constructor(private router: Router) { }

    public canActivateChild(): boolean {
        return this.checkTokenAuthentication();
    }

    public canActivate(): boolean {
        return this.checkTokenAuthentication();
    }

    private checkTokenAuthentication(): boolean {
        if (UtilityService.IsSessionKeyExists('access_token') &&
            UtilityService.IsSessionKeyExists('expires_in')) {
            // logged in so return true
            return true;
        } else {
            // not logged in so redirect to login page
            this.router.navigate(['/login']);
            return false;
        }
    }
}