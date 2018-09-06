import {
    Component, OnInit, ViewEncapsulation,
    OnDestroy, AfterViewInit
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import { LicensingService } from '../../../shared/services/common.service';
import {
    FormGroup, FormControl, Validators
} from '@angular/forms';

@Component({
    selector: 'licensing-applykey',
    templateUrl: '../views/licensing.applykey.view.html',
    encapsulation: ViewEncapsulation.None
})
export class LicensingApplyKeyComponent implements OnInit, OnDestroy, AfterViewInit {
    protected onRouteChange: Subscription;
    private id: number;
    public form: FormGroup;

    constructor(private licensingService: LicensingService,
        private router: Router,
        private route: ActivatedRoute) { }

    verifyKey(values: object): void {
        let data: string = this.form.controls['key'].value;
        this.licensingService.SetLicenseInfo(data)
            .subscribe((item) => {
                this.router.navigate(['/login']);
            }, (error: any) => {
                console.log(`Error: ${error.message}`);
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