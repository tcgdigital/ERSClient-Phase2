import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { UtilityService } from '../../shared/services';




@Component({
    selector: 'landing-main',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './views/landing.view.html',
    styleUrls: ['./styles/landing.style.scss']
})

export class LandingComponent implements OnInit {
    public incidentId:number=0;
    constructor(private router: Router) { };

    ngOnInit(): void {
        UtilityService.RemoveFromSession('CurrentIncidentId');
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