import {
    Component, OnInit, ViewEncapsulation,
    ElementRef, OnDestroy, AfterViewInit
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { LicensingService } from '../../../shared/services/common.service';
import { LicenseInformationModel, LicenseVerificationResponse } from '../../../shared/models';
import {
    FormGroup, FormControl, FormBuilder, Validators,
    ReactiveFormsModule
} from '@angular/forms';

@Component({
    selector: 'licensing-applykey',
    templateUrl: '../views/licensing.applykey.view.html',
    encapsulation: ViewEncapsulation.None
})

export class LicensingApplyKeyComponent implements OnInit, OnDestroy, AfterViewInit {
    protected onRouteChange: Subscription;
    private id: number;
    private onClickVerify: string;
    public form: FormGroup;

    constructor(private licensingService: LicensingService,
        private elementRef: ElementRef,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder) { }

    verifyKey(values: object): void {
        let data: string = this.form.controls['key'].value;
        this.licensingService.SetLicenseInfo(data)
            .subscribe((item) => {
                this.router.navigate(['/login']);
            });
    }

    ngOnInit() {
        this.resetLicenseForm();
        this.onRouteChange = this.route.params.subscribe((param) => {
            this.id = +param['id'];
        });
    }

    ngAfterViewInit(): void {
        /*const $self = jQuery(this.elementRef).find('#key');
        //jQuery.mask.definitions['L'] = "[a-zA-Z0-9]"
        $self.mask("LLLLLL-LLLLLL-LLLLLL-LLLLLL", {
            placeholder: "XXXXXX-XXXXXX-XXXXXX-XXXXXX"
        });
        $self.focus();*/
    }

    ngOnDestroy() {
        this.onRouteChange.unsubscribe();
    }

    private resetLicenseForm() {
        this.form = new FormGroup({
            key: new FormControl('', [Validators.required])
        });
    }
}