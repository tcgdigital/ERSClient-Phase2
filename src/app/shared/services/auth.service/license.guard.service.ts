import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild } from '@angular/router';
import { LicensingService } from '../common.service';
import { LicenseVerificationResponse, LicenseInformationModel } from '../../../shared/models';
@Injectable()
export class LicenseGuard implements CanActivate, CanActivateChild {
    constructor(private router: Router, private licensingService: LicensingService) { }

    public canActivateChild(): boolean {
        return this.checkTokenAuthentication();
    }

    public canActivate(): boolean {
        return this.checkTokenAuthentication();
    }

    private checkTokenAuthentication(): boolean {
        this.licensingService.VerifyLicense()
            .subscribe((response: LicenseVerificationResponse) => {
                if (response.Code == 101) {
                    return true;
                }
                else {
                    this.router.navigate(['/licensing/${response.Code}']);
                    return false;
                }
            }, (error: any) => {
                console.log(`Error: ${error}`);
            });
        return true;
    }
}

