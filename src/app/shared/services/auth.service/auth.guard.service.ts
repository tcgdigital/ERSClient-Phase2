import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
/** The auth guard is used to prevent unauthenticated users from accessing restricted routes,
 * it's used in app.routing.ts to protect the home page route
 */
export class AuthGuardService implements CanActivate {
    constructor(private router: Router) { }

    canActivate(): boolean {
        if (sessionStorage.getItem('USER_INFO')) {
            // logged in so return true
            return true;
        }
        debugger;
        // not logged in so redirect to login page
        this.router.navigate(['/login']);
        return false;
    }
}