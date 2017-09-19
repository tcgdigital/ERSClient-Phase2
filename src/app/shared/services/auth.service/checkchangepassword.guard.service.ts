import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild } from '@angular/router';
import { UtilityService } from '../../../shared';

@Injectable()
/** The auth guard is used to prevent unauthenticated users from accessing restricted routes,
 * it's used in app.routing.ts to protect the home page route
 */
export class CheckChangePasswordGuardService implements CanActivate {
    constructor(private router: Router) { }

    public canActivate(): boolean {
        return this.checkIsChangepasswordRequired();
    }

    private checkIsChangepasswordRequired(): boolean {
        if (UtilityService.IsSessionKeyExists('IsChangPasswordRequired')) {
            // logged in so return true
            return true;
        } else {
            // not logged in so redirect to login page
            this.router.navigate(['/login']);
            return false;
        }
    }
}