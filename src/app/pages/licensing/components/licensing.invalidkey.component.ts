import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
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
    
    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.invalidLicenseText='';
        this.onRouteChange = this.route.params.subscribe((param) => {
            this.id = +param['id'];
            this.licenseValidatorCodes = GlobalConstants.LicenseValidationCode.filter((item)=>{
                return item.key==this.id;
            })[0].value;
        });
    }
}