import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { LicensingService } from '../../../shared/services/common.service';
import { LicenseVerificationResponse, LicenseInformationModel } from '../../../shared/models';
import {GlobalConstants} from '../../../shared';
@Component({
    selector: 'licensing-invalidkey',
    templateUrl: '../views/licensing.invalidkey.view.html',
    encapsulation: ViewEncapsulation.None
})

export class LicensingInvalidKeyComponent implements OnInit {
    protected onRouteChange: Subscription;
    private id: number;
    public invalidLicenseText:string;
    public licenseValidatorCodes: string;
    
    constructor(private licensingService: LicensingService,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.invalidLicenseText='';
       this.onRouteChange = this.route.params.subscribe((param) => {
           this.id = +param['id'];
           this.licenseValidatorCodes =GlobalConstants.LicenseValidationCode.filter((item)=>{
            return item.key==this.id;
           })[0].value;
       });
         

    }
    ngOnDestroy() {
    
    }

}