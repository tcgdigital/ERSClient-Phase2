import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LicensingModel } from '../licensing';
import { Subscription } from 'rxjs/Rx';
import { ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
    selector: 'licensing-main',
    templateUrl: './views/licensing.view.html',
    styleUrls: ['./styles/licensing.style.scss'],
    encapsulation: ViewEncapsulation.None
})

export class LicensingComponent implements OnInit {
     protected onRouteChange: Subscription;
      private id: number;
    constructor( private route: ActivatedRoute) { }

    ngOnInit(): void { 
    }

    ngOnDestroy(): void {
    }
}