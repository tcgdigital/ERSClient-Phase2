import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';






@Component({
    selector: 'landing-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/landing.view.html',
    styleUrls: ['./styles/landing.style.scss']
})

export class LandingComponent implements OnInit {

    constructor(private router: Router) { };

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    onInitiateEmergencyLinkClick(): void {
        this.router.navigate(['pages/incident']);
    }
    onMasterDataLinkClick(): void {
        this.router.navigate(['pages/masterdata']);
    }
    onArchiveLinkClick(): void {
        this.router.navigate(['pages/archivelist']);
    }
}